// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all collections
export async function getCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) console.error('Error fetching collections:', error)
  return data || []
}

// Fetch looks by collection
export async function getLooksByCollection(collectionId: string) {
  const { data, error } = await supabase
    .from('looks')
    .select('*')
    .eq('collection_id', collectionId)
    .order('order', { ascending: true })
  
  if (error) console.error('Error fetching looks:', error)
  return data || []
}

// Fetch single look
export async function getLook(lookId: string) {
  const { data, error } = await supabase
    .from('looks')
    .select('*')
    .eq('id', lookId)
    .single()
  
  if (error) console.error('Error fetching look:', error)
  return data
}
