'use client'

import { useEffect, useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import Image from 'next/image'

export default function AuthenticationLoadingPage() {
  const [progress, setProgress] = useState(0)
  
  // Simulate authentication progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 400)
    
    // Simulate redirect after authentication completes
    const timeout = setTimeout(() => {
      // In a real app, you would redirect to the dashboard or home page
      console.log('Authentication complete, redirecting...')
    }, 4000)
    
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="inline-block bg-white rounded-full p-3 shadow-lg mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
            alt="RaaziYog Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-8 w-8 text-teal-700" />
              </div>
              <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e2f5f5" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#0d9488" 
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-teal-800">
            Authenticating
          </h1>
          
          <p className="text-teal-600">
            Please wait while we verify your credentials.
            You'll be redirected to your dashboard shortly.
          </p>
          
          <div className="w-full bg-teal-100 rounded-full h-2.5">
            <div 
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-teal-500">
            <div className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse"></div>
            <span>Secure connection established</span>
          </div>
        </div>
        
        <p className="text-teal-700 text-sm mt-4">
          Welcome back to RaaziYog. Preparing your personalized yoga experience.
        </p>
      </div>
    </div>
  )
}