import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface PaymentFailedProps {
  errorMessage: string
}

export function PaymentFailed({errorMessage }: PaymentFailedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Payment Failed</CardTitle>
          <CardDescription className="text-gray-600">
            We were unable to process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Booking ID:</span>
            <span className="text-sm font-semibold text-gray-700">{bookingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Amount:</span>
            <span className="text-lg font-bold text-gray-800">{totalAmount}</span>
          </div> */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </CardContent>
        {/* <CardFooter className="flex flex-col space-y-2">
          <Link href="/payment/retry" className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Try Payment Again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </CardFooter> */}
      </Card>
    </div>
  )
}