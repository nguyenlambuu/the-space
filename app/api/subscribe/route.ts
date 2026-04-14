import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { EmailSignupResponse } from '../../lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest): Promise<NextResponse<EmailSignupResponse>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 })
  }

  const email = typeof (body as Record<string, unknown>).email === 'string'
    ? ((body as Record<string, unknown>).email as string).trim().toLowerCase()
    : ''

  if (!email) {
    return NextResponse.json({ success: false, message: 'Email address is required.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 })
  }

  if (email.length > 254) {
    return NextResponse.json({ success: false, message: 'Email address is too long.' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabase
    .from('email_subscribers')
    .insert({ email, source: 'website' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: true, message: 'You are already subscribed.' }, { status: 200 })
    }
    console.error('Error inserting subscriber:', error)
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Thank you for subscribing.' }, { status: 201 })
}