"use client"
import SignUpComponent from "@/app/signup/signupComponent";
import { checkToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter()
  useEffect(() => {
    const fn = async () => {
      const user = await checkToken()
      if (user) {
        router.push("/dashboard")
      }
    }
    fn()
  }, [])
  return <SignUpComponent />;
}