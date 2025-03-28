import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const raazi_yog_tk = 'raazi_yog_tk'
export const raazi_yog_tk_refresh = 'raazi_yog_tk_refresh'

export async function checkToken() {
  try{
  const raazi_yog_tk = localStorage.getItem('raazi_yog_tk')
  if (!raazi_yog_tk) {
    return null
  }
  let user = jwt.verify(raazi_yog_tk, process.env.NEXT_PUBLIC_JWT_SECRET!)
  if (!user) {
    const raazi_yog_tk_refresh = localStorage.getItem('raazi_yog_tk_refresh')
    if (!raazi_yog_tk_refresh) {
      return null
    }
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: raazi_yog_tk_refresh }),
    })
    if (!response) {
      return null
    }
    const token = (await response.json()).token
    if (!token) {
      return null
    }
    localStorage.setItem('raazi_yog_tk', token)
    user = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!)
    if (!user) {
      return null
    }
  }
  return user
  } catch (error) {
    localStorage.removeItem('raazi_yog_tk')
    localStorage.removeItem('raazi_yog_tk_refresh')
    return null
  }
}