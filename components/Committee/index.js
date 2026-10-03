import React, { useEffect, useRef, useState } from 'react'
import Member from './Member'

const CURRENT_YEAR = '2027'
const PAST_YEARS = ['2026', '2025', '2024', '2023', '2022']

// sticky stack: year title text at 2rem (lines up with the about page text column),
// section titles 1rem below it = 2rem + year title line height per page-header-font breakpoint
// year title is opaque from the viewport top so a leaving section title slides under it
const YEAR_TITLE_STICKY = 'top-0 pt-8 pb-4 bg-club-blue-900'
const SECTION_TITLE_TOP = 'top-8'
const SECTION_UNDER_YEAR_TITLE_TOP = 'top-[5.25rem] sm:top-[5.5rem] 2xl:top-24'

// fade band behind the pinned titles so members scroll under them cleanly
const FADE_HEIGHT = 'h-28 -mb-28'
const FADE_UNDER_YEAR_TITLE_HEIGHT = 'h-48 -mb-48'

// root collapsed to a 0px line along the viewport top edge
const VIEWPORT_TOP_EDGE = { rootMargin: '0px 0px -100% 0px' }

/**
 * Tracks whether an element crosses the top edge of the viewport.
 * @returns {[React.MutableRefObject<HTMLElement>, boolean]} ref to attach, crossing state
 */
const useSpansViewportTop = () => {
  const ref = useRef(null)
  const [spans, setSpans] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSpans(entry.isIntersecting),
      VIEWPORT_TOP_EDGE
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, spans]
}

const Committee = () => {
  const [current, setCurrent] = useState(null)
  const [past, setPast] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/profiles/${CURRENT_YEAR}/profiles.json`)
        const data = await res.json()
        setCurrent(data)

        const pastData = await Promise.all(
          PAST_YEARS.map(async (y) => {
            try {
              const r = await fetch(`/profiles/${y}/profiles.json`)
              if (!r.ok) return null
              const j = await r.json()
              return { year: y, content: j }
            } catch (e) {
              return null
            }
          })
        )

        setPast(pastData.filter(Boolean))
      } catch (err) {
        // keep component resilient on fetch errors
        console.error('Failed to load profiles', err)
      }
    }

    load()
  }, [])

  if (!current) return null

  return (
    <>
      <Year profilePath={current.PROFILE_PATH} committee={current.COMMITTEE} />
      {past.map(({ year, content }) => (
        <Year
          key={year}
          title={`${year} Committee`}
          profilePath={content.PROFILE_PATH}
          committee={content.COMMITTEE}
        />
      ))}
    </>
  )
}

const Year = ({ title, profilePath, committee }) => {
  const [ref, pinned] = useSpansViewportTop()
  const { general, executives } = committee
  const sectionTop = title ? SECTION_UNDER_YEAR_TITLE_TOP : SECTION_TITLE_TOP
  const fadeHeight = title ? FADE_UNDER_YEAR_TITLE_HEIGHT : FADE_HEIGHT

  return (
    <div ref={ref} className="pb-16">
      {/* only while titles are pinned, otherwise the band covers the first row of members */}
      <div
        className={`sticky top-0 z-30 sticky-fade transition-opacity ${fadeHeight} ${
          pinned ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {title && (
        <h1
          className={`sticky ${YEAR_TITLE_STICKY} z-50 page-header-font text-center mb-4`}
        >
          {title}
        </h1>
      )}
      <div className="space-y-12">
        <Section
          title="Executive Committee"
          members={executives}
          profilePath={profilePath}
          topClass={sectionTop}
        />
        <Section
          title="General Committee"
          members={general}
          profilePath={profilePath}
          topClass={sectionTop}
        />
      </div>
    </div>
  )
}

const Section = ({ title, members, profilePath, topClass }) => (
  <div>
    <h2
      className={`sticky ${topClass} z-40 subheader-font text-center mb-8 sm:mb-12`}
    >
      {title}
    </h2>
    <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 justify-items-center">
      {members.map((mem) => (
        <Member
          key={mem.id}
          name={mem.name}
          title={mem.title}
          img={mem.img}
          text={mem.text}
          profilePath={profilePath}
        />
      ))}
    </div>
  </div>
)

export default Committee
