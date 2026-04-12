import type { Metadata } from 'next'
import TopAppBar from '../components/UI/TopAppBar'

export const metadata: Metadata = {
  title: 'About Trinh Chau',
  description: 'NTK Trinh Chau — nhà thiết kế thời trang Việt Nam. Learn about the designer behind The Space: her journey, influences, and commitment to craft over trend.',
  alternates: { canonical: 'https://trinhchau.com/about' },
  openGraph: {
    title: 'About Trinh Chau — Fashion Designer',
    description: 'NTK Trinh Chau — Vietnamese fashion designer working at the intersection of heritage craft and contemporary restraint.',
    url: 'https://trinhchau.com/about',
  },
}
import BottomNav from '../components/UI/BottomNav'
import Link from 'next/link'
import Image from 'next/image'
import { getOwnerProfile } from '../lib/supabase'

const journey = [
  {
    index: '01',
    era: 'The Beginning',
    title: 'The First Stitch',
    body: 'Born into a world of fabric and form, Trinh Chau discovered fashion as a language — a way to speak without words. Each early piece was a sentence, hand-sewn in silence.',
    align: 'left',
  },
  {
    index: '02',
    era: 'Formal Study',
    title: 'The Atelier Years',
    body: 'Rigorous training honed her eye for construction and proportion. She learned that restraint is the highest form of craft — that what is left out defines the work as much as what remains.',
    align: 'right',
  },
  {
    index: '03',
    era: 'First Collections',
    title: 'The Seasonal Debut',
    body: 'Her debut collections drew on the textures of Vietnamese landscapes — the blurred margins between monsoon and dry season, the layered greens of the delta — translated into silhouette and drape.',
    align: 'left',
  },
  {
    index: '04',
    era: 'Now',
    title: 'The Ongoing Work',
    body: 'Each new season is a continuation, not a reinvention. The vocabulary deepens, the silhouettes evolve, and the commitment to garments that outlast their moment remains absolute.',
    align: 'right',
  },
]

const press = [
  {
    quote: '"A designer who understands that fashion is, at its core, an act of patience."',
    source: 'Vogue Vietnam',
  },
  {
    quote: '"Her work achieves what few can — a quietness that commands the room."',
    source: 'L\'Officiel',
  },
  {
    quote: '"Each piece is an argument for slowness in an industry that never stops moving."',
    source: 'Harper\'s Bazaar',
  },
]

export default async function AboutPage() {
  const profile = await getOwnerProfile()

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <TopAppBar backHref="/" rightLabel="The Works" rightHref="/works" />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          {/* Portrait block */}
          <div className="w-full aspect-[3/4] max-h-[70vh] bg-surface-container-high relative overflow-hidden">
            {profile?.profile_photo_url ? (
              <Image
                src={profile.profile_photo_url}
                alt={profile.display_name ?? 'Trinh Chau'}
                fill
                className="object-cover object-top"
                priority
              />
            ) : null}
            <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent">
              <p className="text-[0.6875rem] uppercase tracking-label font-medium text-on-secondary/60 mb-2">
                The Designer
              </p>
            </div>
          </div>

          {/* Name + quote overlay card */}
          <div className="px-6 -mt-12 relative z-10">
            <div className="bg-background pt-10 pb-8">
              <h1 className="text-[3.5rem] leading-[1.0] font-bold tracking-display text-inverse-surface mb-1">
                {profile?.display_name?.split(' ').slice(0, -1).join(' ') || 'Trinh'}
              </h1>
              <h1 className="text-[3.5rem] leading-[1.0] font-bold tracking-display text-secondary mb-6">
                {profile?.display_name?.split(' ').slice(-1)[0] || 'Chau'}
              </h1>
              <p className="text-sm leading-relaxed text-on-surface-variant max-w-xs italic">
                &ldquo;Fabric is the medium. Silence is the method. The garment is what remains when both are removed.&rdquo;
              </p>

              {/* Social buttons */}
              {(profile?.social_instagram || profile?.social_zalo) && (
                <div className="flex gap-4 mt-8 flex-wrap">
                  {profile.social_instagram && (
                    <a
                      href={profile.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-inverse-surface text-on-inverse-surface text-[0.6875rem] uppercase tracking-label font-medium px-5 py-3 hover:opacity-80 transition-opacity duration-300 no-underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {profile.social_zalo && (
                    <a
                      href={profile.social_zalo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-secondary text-secondary text-[0.6875rem] uppercase tracking-label font-medium px-5 py-3 hover:bg-secondary hover:text-on-secondary transition-colors duration-300 no-underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 16.708l-.69.691a1.17 1.17 0 01-1.395.19c-.93-.52-1.804-1.132-2.6-1.832a16.678 16.678 0 01-2.168-2.494 10.8 10.8 0 01-1.252-2.4 1.17 1.17 0 01.254-1.284l.74-.74a.585.585 0 01.828 0l1.49 1.49a.585.585 0 010 .828l-.492.492c.397.628.856 1.214 1.372 1.752a9.51 9.51 0 001.956 1.512l.478-.478a.585.585 0 01.828 0l1.651 1.65a.585.585 0 010 .623z"/>
                      </svg>
                      Zalo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Statement ── */}
        <section className="bg-surface-container-low px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary mb-10">
              On the Work
            </p>
            <p className="text-lg leading-[1.7] text-on-surface mb-6">
              Trinh Chau works at the intersection of heritage and restraint. Her collections are not seasonal products — they are arguments. Arguments for craft over trend, for material honesty over spectacle, for the body as the final arbiter of form.
            </p>
            <p className="text-base leading-[1.7] text-on-surface-variant mb-6">
              Trained in both Western tailoring traditions and deeply informed by the textile cultures of Vietnam, her work holds these two inheritances in productive tension. A jacket may be cut with European precision and finished with Vietnamese silk that carries a century of weaving knowledge in its hand.
            </p>
            <p className="text-base leading-[1.7] text-on-surface-variant">
              The result is clothing that rewards extended attention — that reveals itself slowly, the way a room does when you sit in it long enough for your eyes to adjust.
            </p>
          </div>
        </section>

        {/* ── The Journey ── */}
        <section className="bg-background px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary mb-3">
              A Life in Cloth
            </p>
            <h2 className="text-[2rem] leading-[1.05] font-bold tracking-display text-inverse-surface mb-16">
              The Designer&rsquo;s Journey
            </h2>

            <div className="flex flex-col gap-0">
              {journey.map((item, i) => (
                <div
                  key={i}
                  className={`py-10 border-t border-outline-variant/15 ${
                    item.align === 'right' ? 'pl-10' : ''
                  }`}
                >
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="text-[0.6875rem] uppercase tracking-label text-on-surface-variant/30 shrink-0 w-6">
                      {item.index}
                    </span>
                    <span className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary">
                      {item.era}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-inverse-surface mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant max-w-sm">
                    {item.body}
                  </p>
                </div>
              ))}
              <div className="border-t border-outline-variant/15" />
            </div>
          </div>
        </section>

        {/* ── Press ── */}
        <section className="bg-surface-container-low px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary mb-3">
              Press & Recognition
            </p>
            <h2 className="text-[2rem] leading-[1.05] font-bold tracking-display text-inverse-surface mb-12">
              In Their Words
            </h2>

            <div className="flex flex-col gap-6">
              {press.map((item, i) => (
                <div key={i} className="bg-background p-8">
                  <p className="text-base leading-[1.7] text-on-surface mb-4 italic">
                    {item.quote}
                  </p>
                  <p className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary">
                    {item.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Archive CTA ── */}
        <section className="bg-background px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <p className="text-[0.6875rem] uppercase tracking-label font-medium text-secondary mb-6">
              The Work Itself
            </p>
            <h2 className="text-[2rem] leading-[1.05] font-bold tracking-display text-inverse-surface mb-8">
              Enter the Archive
            </h2>
            <p className="text-base leading-relaxed text-on-surface-variant max-w-xs mb-10">
              The collections are best experienced without commentary. Browse them in the order they were made, or follow your eye.
            </p>
            <div className="flex gap-6 flex-wrap">
              <Link
                href="/seasons"
                className="inline-block bg-secondary text-on-secondary text-[0.6875rem] uppercase tracking-label font-medium px-6 py-4 hover:bg-secondary-dim transition-colors duration-300 no-underline"
              >
                Browse the Seasons
              </Link>
              <Link
                href="/works"
                className="text-[0.6875rem] font-medium uppercase tracking-label text-secondary border-b border-secondary/30 pb-1 hover:border-secondary transition-colors duration-300 no-underline self-end mb-[1px]"
              >
                Peruse the Archive
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface-container px-6 py-10">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <Image
              src="/logo/Black.svg"
              alt="Trinh Chau"
              width={120}
              height={36}
              className="h-9 w-auto opacity-70"
            />
            <p className="text-[0.6rem] text-on-surface-variant/50 uppercase tracking-label">
              A curated showing
            </p>
          </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
