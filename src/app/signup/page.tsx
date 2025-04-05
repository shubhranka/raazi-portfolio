"use client"
import SignUpComponent from "@/app/signup/signupComponent";
import LogoLoader from "@/components/logo-loader";
import { checkToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fn = async () => {
      const user = await checkToken()
      if (user) {
        router.push("/dashboard")
      }
      setLoading(false)
    }
    fn()
  }, [router])

  if (loading) {
    return <LogoLoader />
  }
  return <SignUpComponent />;
}