"use client"

import FinalBookSession from "./booking_page";
import { useRouter } from "next/navigation"
import { checkToken } from "@/lib/utils"
import { useEffect, useState } from "react"
import { LoaderPinwheel } from "lucide-react";

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const func = async () => {
      const user = await checkToken()
      if (!user) {
        router.push('/signup')
      }
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

  router.replace('/dashboard')

  return (
    <div> Hello </div>
  );
}