import React from 'react'

// round face, evenodd cuts out the eyes and smile
const FACE =
  'M12 2A10 10 0 1 1 12 22A10 10 0 1 1 12 2Z' +
  // pill eyes resting on the horizontal diameter
  'M9.2 8.4A.9.9 0 0 1 10.1 9.3V11.1A.9.9 0 0 1 8.3 11.1V9.3A.9.9 0 0 1 9.2 8.4Z' +
  'M14.8 8.4A.9.9 0 0 1 15.7 9.3V11.1A.9.9 0 0 1 13.9 11.1V9.3A.9.9 0 0 1 14.8 8.4Z' +
  // smile: 1.4 wide stroke on a radius 5.6 arc about the face centre, round caps,
  // 40 to 120 deg so the arc tilts up to the right for a friendlier lopsided grin
  'M16.8261 16.0496A6.3 6.3 0 0 1 8.85 17.456A.7.7 0 0 1 9.55 16.2435' +
  'A4.9 4.9 0 0 0 15.7536 15.1497A.7.7 0 0 1 16.8261 16.0496Z'

/**
 * Smiling round face with pill eyes.
 * Drawn on a 24px grid like Material Symbols and filled with currentColor.
 * @param {object} props
 * @param {string} [props.title] accessible name, icon is decorative when omitted
 * @param {string} [props.className] sizing and colour classes
 * @returns {JSX.Element}
 */
const CoderIcon = ({ title, className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d={FACE} />
  </svg>
)

export default CoderIcon
