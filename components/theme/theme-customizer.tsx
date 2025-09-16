"use client"

import { useEffect, useState } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const palettes = [
  { id: "emerald", label: "زمردي", swatch: ["#10b981", "#065f46"] },
  { id: "cyan", label: "سماوي", swatch: ["#06b6d4", "#0e7490"] },
  { id: "purple", label: "بنفسجي", swatch: ["#8b5cf6", "#6d28d9"] },
  { id: "amber", label: "عنبر", swatch: ["#f59e0b", "#b45309"] },
  { id: "rose", label: "وردي", swatch: ["#f43f5e", "#be123c"] },
  { id: "indigo", label: "نيلي", swatch: ["#6366f1", "#4338ca"] },
]

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("accent")
    if (saved) setCurrent(saved)
  }, [])

  const apply = (id: string) => {
    document.documentElement.setAttribute("data-accent", id)
    localStorage.setItem("accent", id)
    setCurrent(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:shadow-glow" aria-label="لوحة الألوان">
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>اختر لوحة الألوان</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => apply(p.id)}
              className={`group flex items-center gap-3 rounded-lg border p-3 text-right transition hover:shadow-glow ${
                current === p.id ? "ring-2 ring-accent" : ""
              }`}
            >
              <span className="flex h-6 w-6 overflow-hidden rounded-full">
                <span className="block h-full w-1/2" style={{ backgroundColor: p.swatch[0] }} />
                <span className="block h-full w-1/2" style={{ backgroundColor: p.swatch[1] }} />
              </span>
              <span className="text-sm font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
