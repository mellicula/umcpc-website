import Image from 'next/image'
import React from 'react'
import CoderIcon from '../shared/CoderIcon'

// img starting with this is a full path, lets a year reuse a photo from another year's folder
const PROFILES_ROOT = '/profiles/'

const Member = ({ name, title, img, text, profilePath }) => {
  return (
    <div className="flex flex-col items-center h-fit mb-8 xl:mb-16">
      <div className="relative mb-2 group">
        <div className="relative w-40 xl:w-48 h-40 xl:h-48 rounded-full">
          {img ? (
            <Image
              className="rounded-full"
              src={img.startsWith(PROFILES_ROOT) ? img : profilePath + img}
              alt="Committee member profile picture."
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full rounded-full bg-club-blue-400">
              <CoderIcon className="w-3/5 h-3/5 text-white" />
            </div>
          )}
        </div>
        {text && (
          <div className="member-tooltip group-hover:scale-100">{text}</div>
        )}
      </div>
      <h2 className="text-white font-raleway font-bold text-base xl:text-lg text-center">
        {name}
      </h2>
      <h3 className="text-blue-200 font-raleway text-sm xl:text-base text-center">
        {title}
      </h3>
    </div>
  )
}

export default Member
