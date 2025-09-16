"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Home, BookOpen, Gamepad2, HelpCircle, ImageIcon, Settings, Menu, X, Crown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthButton } from "@/components/auth/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"

const navigationItems = [
  { name: "الرئيسية", href: "/dashboard", icon: Home, roles: ["student", "teacher", "admin"] },
  { name: "الدروس", href: "/lessons", icon: BookOpen, roles: ["student", "teacher", "admin"] },
  { name: "الألعاب", href: "/games", icon: Gamepad2, roles: ["student", "teacher", "admin"] },
  { name: "بنك الأسئلة", href: "/questions", icon: HelpCircle, roles: ["student", "teacher", "admin"] },
  { name: "مكتبة الوسائط", href: "/media", icon: ImageIcon, roles: ["student", "teacher", "admin"] },
  { name: "لوحة التحكم", href: "/admin", icon: Crown, roles: ["teacher", "admin"] },
  { name: "الإعدادات", href: "/settings", icon: Settings, roles: ["student", "teacher", "admin"] },
]

export function Navigation() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user || !profile) {
    return null
  }

  const filteredItems = navigationItems.filter((item) => item.roles.includes(profile.role))

  return (
    <>
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-primary">StudyForge</span>
            </Link>

            <div className="flex items-center gap-1">
              {filteredItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:text-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {profile.points} نقطة
                </Badge>
                <Badge variant="outline" className="text-xs">
                  المستوى {profile.level}
                </Badge>
              </div>
              <ThemeCustomizer />
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold text-primary">StudyForge</span>
            </Link>

            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start gap-2 ${
                          isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:text-accent"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {profile.points} نقطة
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      المستوى {profile.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeCustomizer />
                    <ThemeToggle />
                    <AuthButton />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      <div className="h-16" />
    </>
  )
}
