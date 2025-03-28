"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { checkToken } from "@/lib/utils"
import { LoaderPinwheel } from "lucide-react";
import CheckoutConfirmationPage from "./screen";

export default function Page() {
    const router = useRouter()
    const params = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [course, setCourse] = useState<any>(null)  
    useEffect(() => {
      const func = async () => {
        const user = await checkToken()
        if (!user) {
          router.push('/signup')
        }
        if (!params.get('courseId')) {
          router.push('/courses')
        }
        const course = await fetch(`/api/courses/${params.get('courseId')}`)
        const courseData = await course.json()
        setCourse(courseData)
        setLoading(false)
        setUser(user)
      }
      func()
    }, [])
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <LoaderPinwheel className="h-12 w-12 animate-spin text-gray-700 mx-auto" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
          </div>
        </div>
      );
    }
    return <CheckoutConfirmationPage course={course} user={user} />
}