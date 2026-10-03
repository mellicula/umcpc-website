import React, { useState, useEffect, useMemo } from 'react'
import Committee from '../../components/Committee'
import Socials, {
  DISCORD_URL,
  FACEBOOK_URL,
  UMSU_URL,
} from '../../components/shared/Socials'
import useScrollProgress from '../../lib/useScrollProgress'
import useLineWipe from '../../lib/useLineWipe'

// minProgress: fraction of the committee list scrolled past before the stage shows
const HEADING_STAGES = [
  { minProgress: 0, lead: 'Come meet', underlined: 'our team' },
  { minProgress: 0.2, lead: 'Look back at', underlined: 'past teams' },
]

const InlineLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-link slide-underline"
  >
    {children}
  </a>
)

const AboutUs = () => {
  const [fadeIn, setFadeIn] = useState(false)
  const [committeeRef, progress] = useScrollProgress()

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const stage = HEADING_STAGES.filter((s) => progress >= s.minProgress).pop()
  const [heading, headingRef] = useLineWipe(stage)

  // stable element so per-frame progress updates skip re-rendering every member
  const committee = useMemo(() => <Committee />, [])

  return (
    <div className={`fade-in ${fadeIn ? 'show' : ''}`}>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="mb-16 lg:w-2/5 lg:sticky lg:top-8 lg:self-start">
          {/* pb-4 keeps the underline inside the box, masks hide overflow */}
          <h1
            ref={headingRef}
            className="flex flex-wrap w-fit pb-4 page-header-font"
          >
            <span className="pr-3">{heading.lead}</span>
            <span className="header-underline">{heading.underlined}</span>
          </h1>
          <p className="text-font text-left mt-8 lg:w-4/5">
            Our club is home to all of the University of Melbourne&apos;s
            competitive programming endeavours! We aim to impart a strong
            understanding of algorithms and data structures that are both fun
            and key to a successful future in the tech industry!
          </p>
          <p className="text-font text-left mt-8 lg:w-4/5">
            Come talk to us on{' '}
            <InlineLink href={DISCORD_URL}>Discord</InlineLink>,{' '}
            <InlineLink href={FACEBOOK_URL}>Facebook</InlineLink> or checkout
            our new <InlineLink href={UMSU_URL}>UMSU</InlineLink> page!
          </p>
          <div className="mt-8">
            <Socials />
          </div>
          <p className="text-font mt-8 lg:w-5/6">
            Scroll through our committee members and hover/click over each to
            get to know them better!
          </p>
        </div>
        <div ref={committeeRef} className="flex-1">
          {committee}
        </div>
      </div>
    </div>
  )
}

export default AboutUs
