// scripts/upload-images.mjs
// Uploads looks_example images to Supabase Storage and updates the DB
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Load env from .env.local
const envFile = readFileSync(join(ROOT, '.env.local'), 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const BUCKET = 'media'
const BASE_PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Map local folder names to DB collection slugs
const FOLDER_TO_SLUG = {
  'collection_hoa_sac_Dong_Ho': 'hoa-sac-dong-ho',
  'collection_the_radiant_petals': 'the-radiant-petals',
  'collection_golden_migrate': 'golden-migrate',
}

async function uploadImage(localPath, storagePath) {
  const fileBuffer = readFileSync(localPath)
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })
  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`)
  return `${BASE_PUBLIC_URL}/${storagePath}`
}

async function main() {
  // Fetch all looks with their current photo paths
  const { data: looks, error } = await supabase
    .from('looks')
    .select('id, name, photos')
    .order('sort_order')

  if (error) throw new Error('Failed to fetch looks: ' + error.message)
  console.log(`Found ${looks.length} looks to process\n`)

  let uploaded = 0
  let failed = 0

  for (const look of looks) {
    if (!look.photos || look.photos.length === 0) {
      console.log(`⚠  ${look.name}: no photos, skipping`)
      continue
    }

    const photo = look.photos[0]
    const localUrl = photo.storage_url // e.g. /looks_example/collection_hoa_sac_Dong_Ho/IMG_9074.JPG

    // Parse the local path
    const parts = localUrl.replace(/^\//, '').split('/')
    // parts: ['looks_example', 'collection_hoa_sac_Dong_Ho', 'IMG_9074.JPG']
    const folder = parts[1]
    const filename = parts[2]
    const slug = FOLDER_TO_SLUG[folder]

    if (!slug) {
      console.log(`⚠  ${look.name}: unknown folder '${folder}', skipping`)
      failed++
      continue
    }

    const localFilePath = join(ROOT, 'looks_example', folder, filename)
    const storagePath = `looks/${slug}/${filename}`

    try {
      const publicUrl = await uploadImage(localFilePath, storagePath)

      // Update the look's photos JSONB with real URL
      const updatedPhotos = [
        {
          storage_url: publicUrl,
          storage_path: storagePath,
          uploaded_at: new Date().toISOString(),
        },
      ]

      const { error: updateError } = await supabase
        .from('looks')
        .update({ photos: updatedPhotos })
        .eq('id', look.id)

      if (updateError) throw new Error('DB update failed: ' + updateError.message)

      console.log(`✓  ${look.name} → ${publicUrl}`)
      uploaded++
    } catch (err) {
      console.error(`✗  ${look.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone: ${uploaded} uploaded, ${failed} failed`)
}

main().catch(console.error)
