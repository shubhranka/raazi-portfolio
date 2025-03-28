'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function PaymentRedirectPage() {
  const [dots, setDots] = useState('.')
  
  // Simulate the dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 500);
    
    // Simulate redirect after 5 seconds
    const timeout = setTimeout(() => {
      // In a real app, you would redirect to the payment gateway
      // window.location.href = 'https://payment-gateway.com';
      console.log('Redirecting to payment gateway...');
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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
              <Loader2 className="h-16 w-16 text-teal-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-teal-100"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-teal-800">
            Redirecting to Payment Gateway{dots}
          </h1>
          
          <p className="text-teal-600">
            Please wait while we securely connect you to our payment partner.
            Do not close this window or refresh the page.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-teal-500">
            <div className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse"></div>
            <span>Establishing secure connection</span>
          </div>
        </div>
        
        <p className="text-teal-700 text-sm mt-4">
          You will be automatically redirected to complete your payment for RaaziYog classes.
        </p>
      </div>
    </div>
  )
}