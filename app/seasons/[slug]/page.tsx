import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import TopAppBar from '../../components/UI/TopAppBar'
import BottomNav from '../../components/UI/BottomNav'
import LookCard from '../../components/UI/LookCard'
import { getCollectionBySlug, getLooksByCollection } from '../../lib/supabase'

interface SeasonPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) return {}
  const title = `${collection.name} — Trinh Chau`
  const description = collection.description
    ? `${collection.description} — NTK Trinh Chau.`
    : `${collection.name}: a seasonal collection by NTK Trinh Chau.`
  return {
    title: collection.name,
    description,
    alternates: { canonical: `https://trinhchau.com/seasons/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://trinhchau.com/seasons/${slug}`,
      ...(collection.cover_image ? { images: [{ url: collection.cover_image, alt: collection.name }] } : {}),
    },
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) notFound()

  const looks = await getLooksByCollection(collection.id)

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <TopAppBar backHref="/seasons" rightLabel="The Seasons" rightHref="/seasons" />

      <main className="pb-16">
        {/* Hero — full image, no crop, with text overlay */}
        <section className="relative w-full mb-16 bg-surface-container-high">
          {(collection.cover_image || looks[0]?.image_url) && (
            <Image
              src={collection.cover_image || looks[0].image_url}
              alt={collection.name}
              width={1920}
              height={1080}
              priority
              className="w-full h-auto block"
            />
          )}
          {/* Gradient overlay — strong at bottom where text sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          {/* Text anchored to bottom */}
          <div className="absolute inset-0 flex items-end">
            <div className="px-6 pb-10 max-w-2xl mx-auto w-full">
              <p
                className="text-[0.6875rem] uppercase tracking-label font-medium text-white/80 mb-4"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                <Link href="/seasons" className="no-underline text-white/80 hover:text-white/60 transition-colors">
                  The Seasons
                </Link>
                {' '}·{' '}
                {collection.name}
              </p>
              <h1
                className="text-[2.5rem] leading-[1.05] font-bold tracking-display text-white mb-6"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)' }}
              >
                {collection.name}
              </h1>
              {collection.description && (
                <p
                  className="text-lg leading-relaxed text-white/90 max-w-md"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
                >
                  {collection.description}
                </p>
              )}
              <p
                className="mt-4 text-[0.6875rem] uppercase tracking-label text-white/70"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
              >
                {looks.length} {looks.length === 1 ? 'piece' : 'pieces'} within
              </p>
            </div>
          </div>
        </section>

        {/* Masonry grid using CSS columns */}
        <div className="px-6 max-w-2xl mx-auto">
          {looks.length > 0 ? (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {looks.map((look, i) => (
                <div key={look.id} className="break-inside-avoid">
                  <LookCard look={look} priority={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-on-surface-variant">
              <p className="text-[0.6875rem] uppercase tracking-label">This season holds no pieces as yet</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="seasons" />
    </div>
  )
}
