import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation/navigation"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { VisualBackground } from "@/components/visuals/visual-background"
import { PageTransition } from "@/components/transition/page-transition"
import "./globals.css"

export const metadata: Metadata = {
  title: "StudyForge - منصة تعليمية شاملة",
  description: "منصة تعليمية تفاعلية لتطوير مهاراتك الأكاديمية",
  generator: "StudyForge",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" data-accent="rose">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" storageKey="theme">
          <VisualBackground />
          <Suspense fallback={null}>
            <AuthProvider>
              <Navigation />
              <PageTransition>{children}</PageTransition>
            </AuthProvider>
          </Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
