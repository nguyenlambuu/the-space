// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Collection, Look, SubscriptionStatus } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * email_subscribers table schema:
 *
 * CREATE TABLE email_subscribers (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email       text NOT NULL UNIQUE,
 *   created_at  timestamptz NOT NULL DEFAULT now(),
 *   source      text DEFAULT 'website'
 * );
 *
 * RLS: enable row level security
 *   - INSERT: allow anon (for public signup)
 *   - SELECT: restrict to service_role only
 */

/** Converts a storage_url into a full HTTPS URL.
 *  Handles legacy DB paths: "/looks_example/collection_{name}/{file}"
 *  → "https://xxx.supabase.co/storage/v1/object/public/media/looks/{slug}/{file}"
 */
function resolveStorageUrl(storageUrl: string): string {
  if (!storageUrl) return ''
  if (storageUrl.startsWith('http')) return storageUrl
  const base = supabaseUrl.replace(/\/$/, '')
  // Legacy path pattern: /looks_example/collection_{slug_underscored}/{filename}
  const legacy = storageUrl.match(/^\/looks_example\/collection_([^/]+)\/(.+)$/)
  if (legacy) {
    const slug = legacy[1].replace(/_/g, '-').toLowerCase()
    const filename = legacy[2]
    return `${base}/storage/v1/object/public/media/looks/${slug}/${filename}`
  }
  const path = storageUrl.startsWith('/') ? storageUrl : `/${storageUrl}`
  return `${base}/storage/v1/object/public${path}`
}

function mapLook(l: Record<string, unknown>): Look {
  return {
    id: l.id as string,
    collection_id: l.collection_id as string,
    name: l.name as string,
    materials: Array.isArray(l.tags) && l.tags.length > 0 ? (l.tags as string[]).join(', ') : 'Details forthcoming',
    inspiration: (l.description as string) || '',
    image_url: Array.isArray(l.photos) && l.photos.length > 0 ? resolveStorageUrl((l.photos as Array<{ storage_url: string }>)[0].storage_url) : '',
    order: l.sort_order as number,
  }
}

// Fetch all published collections (with cover image from collection field or first look)
export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name, description, slug, sort_order, cover_photo')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) console.error('Error fetching collections:', error)
  const collections = (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    slug: c.slug,
    order: c.sort_order,
    cover_image: c.cover_photo
      ? resolveStorageUrl((c.cover_photo as { storage_url: string }).storage_url)
      : undefined,
  }))

  if (collections.length === 0) return collections

  // For collections without an explicit cover_image, fall back to first look photo
  const needsCover = collections.filter((c) => !c.cover_image)
  if (needsCover.length > 0) {
    const { data: coverData } = await supabase
      .from('looks')
      .select('collection_id, photos, sort_order')
      .in('collection_id', needsCover.map((c) => c.id))
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    const coverMap = new Map<string, string>()
    for (const row of (coverData || [])) {
      if (!coverMap.has(row.collection_id)) {
        const raw = Array.isArray(row.photos) && row.photos.length > 0
          ? (row.photos[0].storage_url as string)
          : undefined
        const url = raw ? resolveStorageUrl(raw) : undefined
        if (url) coverMap.set(row.collection_id, url)
      }
    }

    return collections.map((c) => ({
      ...c,
      cover_image: c.cover_image || coverMap.get(c.id),
    }))
  }

  return collections
}

// Fetch collection by slug
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name, description, slug, sort_order, cover_photo')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching collection by slug:', error)
    return null
  }
  if (!data) return null
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    slug: data.slug,
    order: data.sort_order,
    cover_image: data.cover_photo
      ? resolveStorageUrl((data.cover_photo as { storage_url: string }).storage_url)
      : undefined,
  }
}

// Fetch looks for a collection
export async function getLooksByCollection(collectionId: string): Promise<Look[]> {
  const { data, error } = await supabase
    .from('looks')
    .select('id, collection_id, name, description, tags, photos, sort_order')
    .eq('collection_id', collectionId)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching looks:', error)
    return []
  }
  return (data || []).map((l) => mapLook(l as Record<string, unknown>))
}

// Fetch a single look by id
export async function getLookById(lookId: string): Promise<Look | null> {
  const { data, error } = await supabase
    .from('looks')
    .select('id, collection_id, name, description, tags, photos, sort_order')
    .eq('id', lookId)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching look by id:', error)
    return null
  }
  if (!data) return null
  return mapLook(data as Record<string, unknown>)
}

// Subscribe an email address to collection updates
export async function subscribeEmail(email: string): Promise<{ status: SubscriptionStatus; message: string }> {
  if (!email || !email.trim()) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const { error } = await supabase
    .from('email_subscribers')
    .insert({ email: email.trim().toLowerCase(), source: 'website' })

  if (error) {
    // Unique violation: already subscribed
    if (error.code === '23505') {
      return { status: 'success', message: 'You are already subscribed.' }
    }
    console.error('Error subscribing email:', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return { status: 'success', message: 'You are now subscribed to collection updates.' }
}

// Fetch all email subscribers (service-role only; will fail under anon RLS)
export async function getEmailSubscribers(): Promise<Array<{ id: string; email: string; created_at: string; source: string }>> {
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('id, email, created_at, source')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching email subscribers:', error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    email: row.email as string,
    created_at: row.created_at as string,
    source: (row.source as string) || 'website',
  }))
}