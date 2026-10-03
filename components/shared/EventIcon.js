import React from 'react'

// calendar body with the page cut out, evenodd turns the inner rect into a hole
const CALENDAR =
  'M5 4.5H19A2 2 0 0 1 21 6.5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V6.5A2 2 0 0 1 5 4.5Z' +
  'M5.75 9A.75.75 0 0 0 5 9.75V18.25A.75.75 0 0 0 5.75 19H18.25A.75.75 0 0 0 19 18.25V9.75' +
  'A.75.75 0 0 0 18.25 9Z'

// trophy cup with handles, sitting on the calendar page
const TROPHY =
  'M9.5 10.5H14.5V12.75A2.5 2.5 0 0 1 9.5 12.75Z' +
  'M8.25 10.5H9.5V13A1.25 1.25 0 0 1 8.25 11.75Z' +
  'M15.75 10.5H14.5V13A1.25 1.25 0 0 0 15.75 11.75Z'

/**
 * Minimalist competition event: calendar page with a trophy on it.
 * Drawn on a 24px grid like Material Symbols and filled with currentColor.
 * @param {object} props
 * @param {string} [props.title] accessible name, icon is decorative when omitted
 * @param {string} [props.className] sizing and colour classes
 * @returns {JSX.Element}
 */
const EventIcon = ({ title, className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title && <title>{title}</title>}
    <rect x="6.75" y="2" width="2" height="4.5" rx="1" />
    <rect x="15.25" y="2" width="2" height="4.5" rx="1" />
    <path fillRule="evenodd" d={CALENDAR} />
    <path d={TROPHY} />
    <rect x="11.5" y="15.25" width="1" height="1.25" />
    <rect x="10" y="16.5" width="4" height="1" rx="0.5" />
  </svg>
)

export default EventIcon
