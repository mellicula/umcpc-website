import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const ERASE_MS = 250
const DRAW_MS = 400

// grow each line's mask past the text box so the underline below it is revealed too
const MASK_PAD_TOP_PX = 8
const MASK_PAD_BOTTOM_PX = 16
const SOLID_MASK = 'linear-gradient(#000 0 0)'
const MASK_PROPS = ['maskImage', 'maskRepeat', 'maskPosition', 'maskSize']

// layout effects warn during SSR, and nothing needs masking before hydration anyway
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

const easeOutQuint = (t) => 1 - (1 - t) ** 5 // quick start, soft landing
const EASE_OUT_QUINT_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)' // css match for easeOutQuint
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2) // slow, fast, slow

/**
 * Measures the rendered text lines of an element.
 * @param {HTMLElement} el element whose text nodes are measured
 * @returns {{ left: number, top: number, width: number, height: number }[]} mask box per
 *   line in px relative to el, top to bottom
 */
const measureLines = (el) => {
  const origin = el.getBoundingClientRect()
  const range = document.createRange()
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const lines = []

  // text node rects are per line fragment, element rects would span wrapped lines
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (!rect.width) continue
      const midY = (rect.top + rect.bottom) / 2
      const line = lines.find((l) => midY > l.top && midY < l.bottom)
      if (line) {
        line.left = Math.min(line.left, rect.left)
        line.right = Math.max(line.right, rect.right)
      } else {
        lines.push({ ...rect.toJSON() })
      }
    }
  }

  lines.sort((a, b) => a.top - b.top)
  const boundary = (above, below) => (above.bottom + below.top) / 2

  // pads stop halfway to neighbouring lines so one line's mask never reveals the next
  return lines.map((l, i) => {
    const prev = lines[i - 1]
    const next = lines[i + 1]
    const top = Math.max(
      l.top - MASK_PAD_TOP_PX,
      prev ? boundary(prev, l) : origin.top
    )
    const bottom = Math.min(
      l.bottom + MASK_PAD_BOTTOM_PX,
      next ? boundary(l, next) : Infinity
    )
    return {
      left: l.left - origin.left,
      top: top - origin.top,
      width: l.right - l.left,
      height: bottom - top,
    }
  })
}

const setMaskStyle = (el, prop, value) => {
  el.style[prop] = value
  el.style[`webkit${prop[0].toUpperCase()}${prop.slice(1)}`] = value
}

/**
 * Reveals text as if one cursor ran through every line in reading order.
 * @param {HTMLElement} el masked element
 * @param {ReturnType<typeof measureLines>} lines output of measureLines(el)
 * @param {number} progress 0 hides everything, 1 reveals everything
 */
const applyMask = (el, lines, progress) => {
  const total = lines.reduce((sum, l) => sum + l.width, 0)
  let remaining = progress * total // px still to reveal, consumed line by line
  const sizes = lines.map((l) => {
    const width = Math.min(Math.max(remaining, 0), l.width)
    remaining -= l.width
    return `${width}px ${l.height}px`
  })

  setMaskStyle(el, 'maskImage', lines.map(() => SOLID_MASK).join(','))
  setMaskStyle(el, 'maskRepeat', 'no-repeat')
  setMaskStyle(
    el,
    'maskPosition',
    lines.map((l) => `${l.left}px ${l.top}px`).join(',')
  )
  setMaskStyle(el, 'maskSize', sizes.join(','))
}

const clearMask = (el) => MASK_PROPS.forEach((p) => setMaskStyle(el, p, ''))

/**
 * Runs a per-frame callback over a fixed duration.
 * @param {number} durationMs animation length
 * @param {(t: number) => void} onFrame called each frame with linear time from 0 to 1
 * @param {() => void} onDone called once after the frame where t reaches 1
 * @returns {() => void} cancels the pending frame
 */
const animate = (durationMs, onFrame, onDone) => {
  const start = performance.now()
  let frame = null
  const tick = (now) => {
    const t = Math.min((now - start) / durationMs, 1)
    onFrame(t)
    if (t < 1) frame = requestAnimationFrame(tick)
    else onDone()
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

/**
 * Swaps displayed text by erasing it line by line (right to left, last line first),
 * then drawing the new text line by line (left to right, first line first).
 * @template T
 * @param {T} value latest value to display, compared by reference
 * @returns {[T, React.MutableRefObject<HTMLElement>]} value to render, ref for the text element
 */
export default function useLineWipe(value) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)
  const [swapCount, setSwapCount] = useState(0) // forces a draw even if value is unchanged
  const shownRef = useRef(value)
  const latest = useRef(value)
  const busy = useRef(false)
  const cancel = useRef(null)
  const heightBefore = useRef(0)
  latest.current = value

  const erase = useCallback(() => {
    const el = ref.current
    if (!el) return
    busy.current = true
    const lines = measureLines(el)
    cancel.current = animate(
      ERASE_MS,
      (t) => applyMask(el, lines, 1 - easeInOutCubic(t)),
      () => {
        heightBefore.current = el.offsetHeight
        shownRef.current = latest.current // value may have changed mid-erase
        setShown(latest.current)
        setSwapCount((n) => n + 1)
      }
    )
  }, [])

  useEffect(() => {
    if (!busy.current && value !== shownRef.current) erase()
  }, [value, erase])

  // layout effect so the new text is masked before its first paint
  useIsomorphicLayoutEffect(() => {
    if (swapCount === 0) return
    const el = ref.current
    const lines = measureLines(el)
    applyMask(el, lines, 0)

    // ease height to the new line count so content below moves with the draw, not a snap
    const heightAfter = el.offsetHeight
    if (heightAfter !== heightBefore.current) {
      el.style.height = `${heightBefore.current}px`
      el.getBoundingClientRect() // commit start height before transitioning
      el.style.transition = `height ${DRAW_MS}ms ${EASE_OUT_QUINT_CSS}`
      el.style.height = `${heightAfter}px`
    }

    cancel.current = animate(
      DRAW_MS,
      (t) => applyMask(el, lines, easeOutQuint(t)),
      () => {
        clearMask(el)
        el.style.height = ''
        el.style.transition = ''
        busy.current = false
        if (latest.current !== shownRef.current) erase()
      }
    )
  }, [swapCount, erase])

  useEffect(() => () => cancel.current?.(), [])

  return [shown, ref]
}
