import React, { useEffect, useRef, useState } from 'react'
import SPONSORS from '../../public/sponsors/sponsors.json'

const DEFAULT_IN_VIEW_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -5% 0px',
}

const SECTION_FADE_DELAY_MS = 80
const FADE_STAGGER_MS = 60
const MAX_STAGGER_STEPS = 5 // later items share the last delay instead of waiting ever longer

const staggerDelay = (index) =>
  Math.min(index, MAX_STAGGER_STEPS) * FADE_STAGGER_MS

const useInView = (opts = DEFAULT_IN_VIEW_OPTIONS) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  const { threshold, rootMargin } = opts

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // reveal once, otherwise content fades out again when scrolled past
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    obs.observe(el)

    return () => obs.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}

export const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView()

  return (
    <div ref={ref}>
      <div
        className={`
          motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out
          ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'motion-safe:opacity-0 motion-safe:translate-y-4'
          }
        `}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  )
}

const ADDITIONAL_THANKS = [
  {
    image: '/sponsors/logos/richard_profile.webp',
    alt: 'Richard (Treasurer 2024)',
    name: 'Richard',
    message: 'For boosting our discord server that one time.',
  },
]

const SponsorCard = ({ sponsor, delay = 0 }) => {
  const card = (
    <FadeIn delay={delay}>
      <div className="relative w-full bg-club-blue-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl border-2 border-club-blue-100">
        {/* fixed height so the card does not jump when the logo loads */}
        <div className="w-full h-64 bg-white flex items-center justify-center p-6 pb-16">
          {sponsor.logo && (
            <img
              src={encodeURI(sponsor.logo)}
              alt={sponsor.name}
              decoding="async"
              className="max-h-full max-w-full object-contain opacity-90 transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="absolute bottom-0 w-full bg-club-blue-800 bg-opacity-90 text-white text-center py-3 text-base sm:text-lg font-bold px-3">
          <span className="truncate block w-full">{sponsor.name}</span>
        </div>

        <div className="absolute inset-0 bg-club-blue-800 bg-opacity-85 text-white p-4 sm:p-6 flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-90">
          <h2 className="font-bold mb-2 text-lg sm:text-xl lg:text-2xl leading-tight">
            {sponsor.name}
          </h2>
          {sponsor.blurb && (
            <p className="mb-4 text-sm sm:text-base text-white/90 leading-snug line-clamp-6">
              {sponsor.blurb}
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  )

  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noreferrer" className="block">
      {card}
    </a>
  ) : (
    card
  )
}

const groupByTier = (items) => {
  const out = {}
  for (const s of items) {
    const t = s.tier || 'Sponsors'
    ;(out[t] ||= []).push(s)
  }
  return out
}

const TIER_ORDER = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Community Partner']

// read at build time so the cards ship in the page html, no fetch or loading state
const SPONSOR_TIERS = (() => {
  const grouped = groupByTier(SPONSORS)
  const ordered = TIER_ORDER.filter((t) => grouped[t]?.length)
  const extra = Object.keys(grouped).filter((t) => !TIER_ORDER.includes(t))
  return [...ordered, ...extra].map((tier) => ({
    tier,
    sponsors: grouped[tier],
  }))
})()

const Sponsors = () => {
  return (
    <div className="flex-1 px-10 pb-16">
      <FadeIn>
        <h1 className="page-header-font mb-6 h-20 header-underline">
          Sponsors
        </h1>
      </FadeIn>

      <FadeIn delay={SECTION_FADE_DELAY_MS}>
        <div className="mb-10 bg-club-blue-800 border-2 border-club-blue-100 rounded-xl shadow-lg p-6 text-white max-w-3xl">
          <p className="text-lg font-semibold mb-2">Our supporters</p>
          <p className="text-white/80 max-w-3xl mx-auto">
            Thanks to our sponsors for helping us run events, support students
            and grow the competitive programming community.
          </p>
        </div>
      </FadeIn>

      {SPONSOR_TIERS.length === 0 && (
        <p className="text-center text-gray-500">No sponsors yet.</p>
      )}

      {SPONSOR_TIERS.map((page, tierIdx) => (
        <div key={page.tier} className="mb-12">
          <FadeIn delay={staggerDelay(tierIdx)}>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="text-white text-2xl font-bold">{page.tier}</h2>
              <div className="text-white/60 text-sm font-semibold">
                {page.sponsors.length} sponsor
                {page.sponsors.length === 1 ? '' : 's'}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {page.sponsors.map((s, i) => (
              <div key={s.id || s.name}>
                <SponsorCard sponsor={s} delay={staggerDelay(i)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <FadeIn delay={SECTION_FADE_DELAY_MS}>
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-8">
            Additional Thanks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {ADDITIONAL_THANKS.map((thanks) => (
              <div
                key={thanks.alt}
                className="w-fit flex flex-col items-center gap-4 text-center"
              >
                <div className="w-44 h-44 p-1 border-2 border-club-blue-100 rounded-full">
                  <img
                    src={thanks.image}
                    alt={thanks.alt}
                    className="w-full h-full rounded-full object-cover object-[25%_center]"
                  />
                </div>
                <div>
                  <p className="text-white text-xl font-bold">{thanks.name}</p>
                  <p className="text-white/80">{thanks.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="pt-6 border-t border-white/10 text-center text-gray-400">
        Want to sponsor an event or workshop? Email{' '}
        <a
          className="font-bold underline underline-offset-4"
          href="mailto:unimelbcpc@gmail.com"
        >
          unimelbcpc@gmail.com
        </a>
      </div>
    </div>
  )
}

export default Sponsors
