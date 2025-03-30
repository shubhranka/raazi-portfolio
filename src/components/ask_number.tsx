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
import { Input } from './ui/input'


interface AskNumberComponentProps {
  googleToken: string
}

export default function AskNumberComponent({ googleToken }: AskNumberComponentProps) {



  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false)
  const router = useRouter()
  const handleSignIn = async () => {
    if(number.length !== 10) {
      toast.error("Please enter a valid phone number.")
      return
    }

    setAuthenticating(true)
    const tokenResponse = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: number,
        token: googleToken
      })
    })

    const tokenData = await tokenResponse.json()
    if(tokenData.error || !tokenData.token) {
      toast.error(tokenData.error)
      router.push('/signup')
      return
    }

    localStorage.setItem(raazi_yog_tk, tokenData.token)
    router.push('/dashboard')
  }

  if (authenticating) {
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
            Please enter your phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center flex-col gap-4">
          <Input
            type="text"
            placeholder="Please enter your phone number"
            value={number}
            minLength={10}
            maxLength={10}
            onChange={(e) => {
                const isNumberOrBlank = /^[0-9]+$/.test(e.target.value) || e.target.value === ''
                if (isNumberOrBlank) {
                    setNumber(e.target.value)
                }
            }}

          />
          <Button onClick={handleSignIn} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}