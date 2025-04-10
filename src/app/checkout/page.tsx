"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect, useState } from "react"
import { checkToken } from "@/lib/utils"
import { LoaderPinwheel } from "lucide-react";
import CheckoutConfirmationPage from "./screen";
import LogoLoader from "@/components/logo-loader";

export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}>
      <SusedPage />
    </Suspense>
}

function SusedPage() {
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
        <LogoLoader />
      );
    }
    return <CheckoutConfirmationPage course={course} user={user} />
}