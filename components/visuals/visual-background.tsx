"use client"

import { useEffect, useState } from "react"
import { Background3D } from "./background-3d"
import { AnimatedShapes } from "./animated-shapes"

export function VisualBackground() {
  const [choice, setChoice] = useState<"3d" | "shapes" | "none">("none")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMd = window.matchMedia("(min-width: 768px)").matches
    const enable3D = localStorage.getItem("enable_3d")
    const enableAnim = localStorage.getItem("enable_animations")
    const animationsOn = enableAnim !== "false" && !reduce

    if (!animationsOn) {
      setChoice("none")
      return
    }

    if (!isMd) {
      setChoice("shapes")
      return
    }

    if (enable3D === "false" || reduce) {
      setChoice("shapes")
    } else {
      setChoice("3d")
    }
  }, [])

  if (choice === "3d") return <Background3D />
  if (choice === "shapes") return <AnimatedShapes />
  return null
}
