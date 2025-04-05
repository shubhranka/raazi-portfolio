'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoLoaderProps {
  /** Optional text to display below the loader */
  text?: string
  /** Optional additional classes */
  className?: string
}

export default function LogoLoader({ text, className }: LogoLoaderProps) {
  const [opacity, setOpacity] = useState(1)
  const [scale, setScale] = useState(1)
  
  // Create pulsing and scaling effect
  useEffect(() => {
    const opacityInterval = setInterval(() => {
      setOpacity(prev => prev === 1 ? 0.4 : 1)
    }, 1200)
    
    const scaleInterval = setInterval(() => {
      setScale(prev => prev === 1 ? 1.1 : 1)
    }, 1200)
    
    return () => {
      clearInterval(opacityInterval)
      clearInterval(scaleInterval)
    }
  }, [])

  return (
    <div className={cn(
      "fixed inset-0 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex flex-col items-center justify-center z-50",
      className
    )}>
      <div className="relative">
        {/* Glow effect behind the logo */}
        <div 
          className="absolute rounded-full bg-teal-400/30 blur-xl"
          style={{
            width: '140px',
            height: '140px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: opacity * 0.8,
            transition: 'opacity 1.2s ease-in-out'
          }}
        />
        
        {/* Pulsing circle behind the logo */}
        <div 
          className="absolute rounded-full border-4 border-teal-500/40"
          style={{
            width: '160px',
            height: '160px',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: opacity,
            transition: 'all 1.2s ease-in-out'
          }}
        />
        
        {/* Logo with fading effect */}
        <div 
          className="relative bg-white rounded-full p-4 shadow-lg"
          style={{
            opacity: opacity,
            transform: `scale(${scale * 0.95})`,
            transition: 'all 1.2s ease-in-out'
          }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
            alt="RaaziYog Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
      </div>
      
      {/* Optional loading text with fade-in effect */}
      {text && (
        <div 
          className="mt-8 text-teal-800 font-medium text-center text-lg"
          style={{
            opacity: opacity,
            transition: 'opacity 1.2s ease-in-out'
          }}
        >
          {text}
        </div>
      )}
      
      {/* Loading dots */}
      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="h-2 w-2 rounded-full bg-teal-600"
            style={{
              animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`
            }}
          />
        ))}
      </div>
      
      {/* CSS for the dots animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}