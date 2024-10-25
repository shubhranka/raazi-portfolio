"use client"
import React, { useEffect } from "react"
import { Confirmation } from "./confirmation"
import { PrismaClient } from "@prisma/client"
import { Loader } from "./loader"
import { useSearchParams } from "next/navigation"
const prisma = new PrismaClient()


export default function AfterPayment() {

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


  return <Confirmation bookingId={bookingId} totalAmount={totalAmount} />
}