import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { UMSU_URL } from '../shared/Socials'

const NAV_LINKS = [
  { href: '/about-us', label: 'About Us' },
  { href: '/events', label: 'Events' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/resources', label: 'Resources' },
]

const Header = () => {
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false)

  const styles = useSpring({
    from: { opacity: '0' },
    to: { opacity: '1' },
    config: { duration: '300' },
  })

  const handleCloseMobileMenu = () => {
    setMobileMenuExpanded(false)
  }

  return (
    <div className="relative mb-16 sm:mb-24">
      <animated.div className="mx-auto" style={styles}>
        <div className="flex justify-between">
          <div className="shrink-0">
            <Link href="/" passHref>
              <a className="block">
                <div className="flex flex-row items-center space-x-3 md:space-x-0 md:flex-col">
                  <div className="h-5 md:h-14 w-5 md:w-14 relative">
                    <Image
                      src="/branding/club-logo.svg"
                      alt="UMCPC Logo"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <p className="flex font-raleway font-bold text-white">
                    umcpc.
                  </p>
                </div>
              </a>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} passHref>
                  <a className="header-btn slide-underline">{label}</a>
                </Link>
              ))}
            </div>
            <a className="rounded-btn" href={UMSU_URL}>
              Join us
            </a>
          </div>
          <div className="md:hidden">
            <div className="flex items-center">
              <button
                className="outline-none mobile-menu-button"
                aria-label="Open menu"
                aria-expanded={mobileMenuExpanded}
                onClick={() => setMobileMenuExpanded(!mobileMenuExpanded)}
              >
                <svg
                  className="w-6 h-6 text-gray-400 hover:text-club-blue-200"
                  x-show="!showMenu"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </animated.div>

      <div className={mobileMenuExpanded ? '' : 'hidden'}>
        <div
          className="fixed inset-0 z-40 bg-club-blue-900/30 backdrop-blur-sm"
          onClick={() => setMobileMenuExpanded(false)}
        ></div>
        <div className="absolute top-0 right-0 z-50 w-44 h-fit pt-4 pb-6 pl-4 bg-[#162638] rounded-lg">
          <div className="flex flex-col space-y-4 items-baseline">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} passHref>
                <a className="menu-btn" onClick={handleCloseMobileMenu}>
                  {label}
                </a>
              </Link>
            ))}
            <div className="w-36 border-2 border-t border-club-blue-700"></div>
            <a
              className="btn-font btn-bg h-6 py-1 px-3 mr-4 rounded-full "
              href={UMSU_URL}
            >
              Join us
            </a>
          </div>
          <button
            className="absolute top-3 right-4 w-6 h-6 flex items-center"
            onClick={() => setMobileMenuExpanded(false)}
          >
            <svg
              className="w-6 h-6 text-gray-300 hover:text-club-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
