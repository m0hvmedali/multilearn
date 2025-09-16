"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, BookOpen, CheckCircle, Play } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { createBrowserClient } from "@supabase/ssr"
import { useParams, useRouter } from "next/navigation"
import { Chatbot } from "@/components/chatbot/chatbot"
import { Whiteboard } from "@/components/whiteboard/whiteboard"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Lesson {
  id: string
  title: string
  title_ar: string
  content: {
    sections: Array<{
      type: "text" | "video" | "image" | "quiz"
      content: string
      title?: string
    }>
  }
  difficulty_level: number
  points_reward: number
  subject: {
    id: string
    name: string
    name_ar: string
    color: string
  }
}

interface UserProgress {
  lesson_id: string
  completed_at: string | null
  score: number
  time_spent: number
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export default function LessonPage() {
  const { user, profile } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)
  const [startTime] = useState(Date.now())
  const [showWhiteboard, setShowWhiteboard] = useState(false)

  useEffect(() => {
    if (params.id && user) {
      fetchLesson()
      fetchProgress()
    }
  }, [params.id, user])

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          subject:subjects(*)
        `)
        .eq("id", params.id)
        .eq("is_published", true)
        .single()

      if (error) throw error
      setLesson(data)
    } catch (error) {
      console.error("Error fetching lesson:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("lesson_id", params.id)
        .single()

      setProgress(data)
    } catch (error) {
      // Progress doesn't exist yet
    }
  }

  const completeLesson = async () => {
    if (!user || !lesson) return

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const score = 100

    try {
      const { error } = await supabase.from("user_progress").upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        completed_at: new Date().toISOString(),
        score,
        time_spent: timeSpent,
      })

      if (error) throw error

      await supabase.rpc("update_user_points", {
        user_uuid: user.id,
        points_to_add: lesson.points_reward,
      })

      if (!progress) {
        await supabase.from("user_achievements").insert({
          user_id: user.id,
          achievement_type: "first_lesson",
          achievement_data: { lesson_id: lesson.id, lesson_title: lesson.title_ar },
        })
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing lesson:", error)
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "مبتدئ"
      case 2:
        return "متوسط"
      case 3:
        return "متقدم"
      case 4:
        return "صعب"
      case 5:
        return "خبير"
      default:
        return "غير محدد"
    }
  }

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-orange-500"
      case 4:
        return "bg-red-500"
      case 5:
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>الدرس غير موجود</CardTitle>
            <CardDescription>لم يتم العثور على الدرس المطلوب</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isCompleted = progress?.completed_at
  const progressPercentage = lesson.content.sections.length > 0 ? ((currentSection + 1) / lesson.content.sections.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة
              </Button>
              <Button variant="outline" onClick={() => setShowWhiteboard(!showWhiteboard)} className="bg-background">
                {showWhiteboard ? "إخفاء اللوحة" : "إظهار اللوحة"}
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary mb-2">{lesson.title_ar}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary" className={`${getDifficultyColor(lesson.difficulty_level)} text-white`}>
                    {getDifficultyLabel(lesson.difficulty_level)}
                  </Badge>
                  <div className="flex items-center gap-1 text-accent">
                    <Trophy className="h-4 w-4" />
                    {lesson.points_reward} نقطة
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {lesson.subject.name_ar}
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-accent">
                      <CheckCircle className="h-4 w-4" />
                      مكتمل
                    </div>
                  )}
                </div>
                <Progress value={progressPercentage} className="w-full max-w-md" />
                <p className="text-sm text-muted-foreground mt-2">
                  {currentSection + 1} من {lesson.content.sections.length} أقسام
                </p>
              </div>
            </div>
          </motion.div>

          {showWhiteboard && (
            <motion.div variants={fadeInUp} className="mb-8">
              <Whiteboard lessonId={lesson.id} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <Card>
              <CardContent className="p-8">
                {lesson.content.sections.length > 0 ? (
                  <div className="space-y-8">
                    {lesson.content.sections.map((section, index) => (
                      <div key={index} className={`${index === currentSection ? "block" : "hidden"}`}>
                        {section.title && <h2 className="text-2xl font-bold text-primary mb-4">{section.title}</h2>}

                        {section.type === "text" && (
                          <div className="prose prose-lg max-w-none">
                            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                          </div>
                        )}

                        {section.type === "video" && (
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">فيديو: {section.content}</p>
                            </div>
                          </div>
                        )}

                        {section.type === "image" && (
                          <div className="text-center">
                            <div className="bg-muted rounded-lg p-8">
                              <p className="text-muted-foreground">صورة: {section.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-8 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                        disabled={currentSection === 0}
                      >
                        السابق
                      </Button>

                      {currentSection < lesson.content.sections.length - 1 ? (
                        <Button onClick={() => setCurrentSection(currentSection + 1)}>
                          التالي
                        </Button>
                      ) : (
                        <Button onClick={completeLesson} disabled={isCompleted}>
                          {isCompleted ? "مكتمل" : "إنهاء الدرس"}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا يوجد محتوى متاح لهذا الدرس حالياً</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Chatbot
        context={`الدرس الحالي: ${lesson.title_ar} في مادة ${lesson.subject.name_ar}. يمكن للطالب أن يسأل عن أي شيء متعلق بهذا الدرس أو المادة.`}
      />
    </div>
  )
}
