import { useEffect, useRef, useState } from 'react'

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)

/**
 * Tracks how far the window has scrolled through an element.
 * @returns {[React.MutableRefObject<HTMLElement>, number]} ref to attach, progress from
 *   0 (element top at viewport top) to 1 (element bottom in view)
 */
export default function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = null

    const update = () => {
      frame = null
      const el = ref.current
      if (!el) return

      const { top, height } = el.getBoundingClientRect()
      const scrollable = height - window.innerHeight
      setProgress(scrollable > 0 ? clamp01(-top / scrollable) : 1)
    }

    // throttle to one measurement per frame
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    // element height changes when async content (e.g. committee profiles) arrives
    const resizeObserver = new ResizeObserver(schedule)
    if (ref.current) resizeObserver.observe(ref.current)

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return [ref, progress]
}
