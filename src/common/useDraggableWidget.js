import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'chatWidgetPos_v2'
const MOBILE_BREAKPOINT = 640
const HEADER_SAFE_TOP = 88

const loadPos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const savePos = (pos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
  } catch {
    /* ignore */
  }
}

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * Returns { style, onPointerDown } to make an element (and optionally a
 * secondary drag-handle) draggable on desktop, persisted to localStorage.
 * Fully disabled on mobile — widget stays fixed bottom-right via CSS.
 */
export const useDraggableWidget = (widgetRef) => {
  const [pos, setPos] = useState(null) // {right, bottom} in px, null = default CSS position
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0, moved: false })

  useEffect(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return
    const saved = loadPos()
    if (saved) setPos(saved)
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) return
      const node = widgetRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      dragState.current = {
        dragging: true,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        moved: false,
      }
      document.documentElement.style.userSelect = 'none'
      e.preventDefault()

      const onMove = (ev) => {
        if (!dragState.current.dragging) return
        dragState.current.moved = true
        const w = node.offsetWidth
        const h = node.offsetHeight
        let left = ev.clientX - dragState.current.offsetX
        let top = ev.clientY - dragState.current.offsetY
        left = clamp(left, 8, window.innerWidth - w - 8)
        top = clamp(top, HEADER_SAFE_TOP, window.innerHeight - h - 8)
        const right = window.innerWidth - left - w
        const bottom = window.innerHeight - top - h
        setPos({ right, bottom })
      }

      const onUp = () => {
        dragState.current.dragging = false
        document.documentElement.style.userSelect = ''
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        setPos((current) => {
          if (current) savePos(current)
          return current
        })
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [widgetRef],
  )

  const style = pos ? { right: pos.right, bottom: pos.bottom, left: 'auto', top: 'auto' } : undefined

  return { style, onPointerDown, hasMoved: () => dragState.current.moved }
}
