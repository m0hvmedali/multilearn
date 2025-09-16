"use client"

import { useEffect, useState } from "react"

export function AnimatedShapes() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const user = localStorage.getItem("enable_animations")
    if (reduce || user === "false") setEnabled(false)
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-50">
      <svg className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vw] -translate-x-1/2" viewBox="0 0 600 600" fill="none">
        <g className="animate-float">
          <circle cx="300" cy="300" r="240" className="fill-emerald-200/30 dark:fill-emerald-400/10" />
        </g>
      </svg>
      <svg className="absolute right-[-10%] bottom-[-10%] h-[40vh] w-[40vw]" viewBox="0 0 600 600" fill="none">
        <g className="animate-float" style={{ animationDuration: "9s" }}>
          <rect x="100" y="100" width="300" height="300" rx="80" className="fill-amber-200/30 dark:fill-amber-300/10" />
        </g>
      </svg>
      <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute right-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
    </div>
  )
}
