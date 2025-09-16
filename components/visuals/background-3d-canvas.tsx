"use client"

import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PresentationControls, Float } from "@react-three/drei"

function useAccentColor() {
  const [color, setColor] = useState("#f43f5e")
  useEffect(() => {
    const get = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
      if (v) {
        if (v.includes("/")) {
          const [h, s, l] = v.split("/")[0].trim().split(" ")
          setColor(`hsl(${h} ${s} ${l})`)
        } else if (/^\d/.test(v)) {
          setColor(`hsl(${v})`)
        } else {
          setColor(v)
        }
      }
    }
    get()
    const observer = new MutationObserver(get)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-accent", "data-theme", "class"] })
    return () => observer.disconnect()
  }, [])
  return color
}

function Shape({ low }: { low: boolean }) {
  const accent = useAccentColor()
  const [rotation, setRotation] = useState([0, 0, 0] as [number, number, number])
  const material = useMemo(() => ({ color: accent, roughness: 0.3, metalness: 0.1 }), [accent])

  useFrame((_, delta) => {
    if (!low) setRotation(([x, y, z]) => [x + delta * 0.08, y + delta * 0.1, z])
  })

  return (
    <Float speed={low ? 0 : 0.5} rotationIntensity={low ? 0 : 0.2} floatIntensity={low ? 0 : 0.5}>
      <mesh rotation={rotation} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, low ? 0 : 1]} />
        <meshStandardMaterial {...material} />
      </mesh>
    </Float>
  )
}

export default function Background3DCanvas() {
  const [canRender, setCanRender] = useState(false)
  const [low, setLow] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const user3D = localStorage.getItem("enable_3d")
    const enabled = user3D !== "false" && !reduce
    const isMd = window.matchMedia("(min-width: 768px)").matches
    setCanRender(enabled && isMd)

    let frames = 0
    let last = performance.now()
    let raf = 0
    const measure = () => {
      frames++
      const now = performance.now()
      if (now - last >= 1000) {
        const fps = frames / ((now - last) / 1000)
        if (fps < 40) setLow(true)
        cancelAnimationFrame(raf)
        return
      }
      raf = requestAnimationFrame(measure)
    }
    raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!canRender) return null

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 hidden md:block">
      <Canvas
        dpr={low ? [1, 1] : [1, 1.5]}
        frameloop={low ? "demand" : "always"}
        gl={{ antialias: !low, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-5, -5, -5]} intensity={0.2} />
        <PresentationControls enabled={false} />
        <Shape low={low} />
      </Canvas>
    </div>
  )
}
