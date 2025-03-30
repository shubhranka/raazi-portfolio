import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const raazi_yog_tk = 'raazi_yog_tk'

export async function checkToken() {
  try{
  const raazi_yog_tk = localStorage.getItem('raazi_yog_tk')
  if (!raazi_yog_tk) {
    return null
  }
  const userData = await fetch('api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: raazi_yog_tk }),
  })

  const user = await userData.json()
  if (!user) {
    return null
  }
  return user
  } catch (error) {
    localStorage.removeItem('raazi_yog_tk')
    return null
  }
}