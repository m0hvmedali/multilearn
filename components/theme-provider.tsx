"use client"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

function ThemeClassSync() {
  const { theme, systemTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    const current = theme === "system" ? resolvedTheme : theme
    const isDark = (theme === "system" ? systemTheme : theme) === "dark" || resolvedTheme === "dark"
    if (current) root.setAttribute("data-theme", current)
    if (isDark) root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme, systemTheme, resolvedTheme])

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("accent") : null
    if (stored) document.documentElement.setAttribute("data-accent", stored)
  }, [])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" storageKey="theme" enableSystem {...props}>
      {children}
      <ThemeClassSync />
    </NextThemesProvider>
  )
}
