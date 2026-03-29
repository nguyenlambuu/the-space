// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Collection, Look } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all published collections
export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name, description, slug, sort_order')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) console.error('Error fetching collections:', error)
  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    slug: c.slug,
    order: c.sort_order,
  }))
}

// Fetch looks by collection
export async function getLooksByCollection(collectionId: string): Promise<Look[]> {
  const { data, error } = await supabase
    .from('looks')
    .select('id, name, description, tags, photos, collection_id, sort_order')
    .eq('collection_id', collectionId)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (error) console.error('Error fetching looks:', error)
  return (data || []).map((l) => ({
    id: l.id,
    collection_id: l.collection_id,
    name: l.name,
    materials: Array.isArray(l.tags) && l.tags.length > 0 ? l.tags.join(', ') : 'Details forthcoming',
    inspiration: l.description || '',
    image_url: Array.isArray(l.photos) && l.photos.length > 0 ? l.photos[0].storage_url : '',
    order: l.sort_order,
  }))
}

// Fetch single look
export async function getLook(lookId: string): Promise<Look | null> {
  const { data, error } = await supabase
    .from('looks')
    .select('id, name, description, tags, photos, collection_id, sort_order')
    .eq('id', lookId)
    .single()

  if (error) console.error('Error fetching look:', error)
  if (!data) return null
  return {
    id: data.id,
    collection_id: data.collection_id,
    name: data.name,
    materials: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags.join(', ') : 'Details forthcoming',
    inspiration: data.description || '',
    image_url: Array.isArray(data.photos) && data.photos.length > 0 ? data.photos[0].storage_url : '',
    order: data.sort_order,
  }
}
