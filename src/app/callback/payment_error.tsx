import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface PaymentNotFoundProps {
  message: string
}

export default function PaymentNotFound({ message }: PaymentNotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Payment Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <p className="text-lg mb-4 text-gray-600">
            {message}
          </p>
          <p className="text-gray-600">
            This could be due to:
          </p>
          <ul className="list-disc list-inside text-left mt-2 mb-4 text-gray-600">
            <li>An incorrect payment ID</li>
            <li>A payment that has been cancelled or expired</li>
            <li>A technical issue on our end</li>
          </ul>
          <p className="text-gray-600">
            If you believe this is an error, please contact our support team for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}