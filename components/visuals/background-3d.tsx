"use client"

import dynamic from "next/dynamic"

const Background3DCanvas = dynamic(() => import("./background-3d-canvas"), { ssr: false })

export function Background3D() {
  return <Background3DCanvas />
}
