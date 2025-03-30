'use client'

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import { auth } from '@/config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { raazi_yog_tk } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import AuthenticationLoadingPage from '@/components/ui/auth-loading'
import { toast } from "sonner"
import AskNumberComponent from '@/components/ask_number'

export default function SignUpComponent() {
  const [loading, setLoading] = useState(false);
  const [actualAuthenticating, setActualAuthenticating] = useState(false)
  const [askNumberData, setAskNumberData] = useState({accessToken: ""})
  const router = useRouter()

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email')
  googleProvider.addScope('profile')
  googleProvider.addScope('phone')

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setActualAuthenticating(true)
      const accessToken = (result.user as any).accessToken;
      // console.log(credential)
      const tokenResponse = await fetch("/api/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
      });
      const tokenData = await tokenResponse.json();
      if(tokenData.requirePhone){
        setAskNumberData({accessToken})
        return
      }
      if (tokenData.token) {
        localStorage.setItem(raazi_yog_tk, tokenData.token);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Sign in failed. Please try again.")
    } finally {
      setActualAuthenticating(false)
      setLoading(false)
    }
  }


  if (askNumberData.accessToken) {
    return <AskNumberComponent googleToken={askNumberData.accessToken}/>
  }

  if (actualAuthenticating) {
    return <AuthenticationLoadingPage/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
              alt="RaaziYog Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-teal-800">Welcome to RaaziYog</CardTitle>
          <CardDescription className="text-center text-teal-600">
            Continue with Google to book your yoga classes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleSignIn} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}