"use client"
import React, { useEffect } from "react"
import { Confirmation } from "./confirmation"
import { PrismaClient } from "@prisma/client"
import { Loader } from "./loader"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
const prisma = new PrismaClient()


export default function CallbackPage() {

  const params = useSearchParams()
  const [loading, setLoading] = React.useState(true)
  const [totalAmount, setTotalAmount] = React.useState(0)
  const [bookingId, setBookingId] = React.useState("")


  useEffect(() => {
    const fetchPayment = async () => {
      const body: any = {}
      params.forEach((value: string, key: string) => {
        body[key] = value
      })
      const paymentStatusResponse = await fetch("api/payment_success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({body}),
      })

      const paymentStatus = await paymentStatusResponse.json()

      if (paymentStatus.success) {
        setLoading(false)
        setTotalAmount(paymentStatus.amount/100)
        setBookingId(paymentStatus.bookingId)
      }
    }

    fetchPayment()
  })


  if (loading) {
    return <Loader />
  }


  return <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-peach-100 py-12 px-4 sm:px-6 lg:px-8">
  <motion.div
    className="max-w-md mx-auto"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  > 
  <Card className="backdrop-blur-md bg-white/70 shadow-xl border-0 overflow-hidden">
  <CardHeader className="bg-gradient-to-r from-teal-400 to-teal-600 text-white">
    <CardTitle className="text-2xl font-bold text-center">Book Your Yoga Journey</CardTitle>
    <CardDescription className="text-center text-white/80">Find your inner peace with us</CardDescription>
  </CardHeader>
  <CardContent className="pt-6 space-y-8 bg-white"> 
    <Confirmation bookingId={bookingId} totalAmount={totalAmount+""} />
  </CardContent>
</Card>
</motion.div>
</div>

}