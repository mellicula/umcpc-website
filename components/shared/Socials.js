import Image from 'next/image'
import React from 'react'

export const DISCORD_URL = 'https://discord.gg/R68WZcgSVp'
export const UMSU_URL =
  'https://umsu.unimelb.edu.au/buddy-up/clubs/clubs-listing/join/6517/'
export const INSTAGRAM_URL = 'https://instagram.com/unimelbcpc'
export const FACEBOOK_URL = 'https://www.facebook.com/umcpc/'

function Socials() {
  return (
    <div className="flex gap-3 sm:gap-2">
      <a href={DISCORD_URL}>
        <div className="social-icon bg-[#5865F2]">
          <div className="h-3 sm:h-6 w-4 sm:w-8 relative">
            <Image
              src="/branding/discord-white.svg"
              alt="Discord Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </a>
      <a href={UMSU_URL}>
        <div className="social-icon bg-[#68217C]">
          <div className="h-4 sm:h-8 w-3 sm:w-7 relative">
            <Image
              src="/branding/umsu.png"
              alt="UMSU Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </a>
      <a href={INSTAGRAM_URL}>
        <div className="social-icon">
          <div className="h-6 sm:h-10 w-6 sm:w-10 relative">
            <Image
              src="/branding/instagram.svg"
              alt="Instagram Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </a>
      <a href={FACEBOOK_URL}>
        <div className="social-icon bg-[#1778F2]">
          <div className="h-4 sm:h-8 w-4 sm:w-8 mb-[2px] sm:mb-1 relative">
            <Image
              src="/branding/facebook-white.svg"
              alt="Facebook Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </a>
    </div>
  )
}

export default Socials
