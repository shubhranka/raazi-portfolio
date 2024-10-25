import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface ConfirmationProps {
  bookingId: string
  totalAmount: string
}

export function Confirmation({ bookingId, totalAmount }: ConfirmationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Payment Successful!</CardTitle>
          <CardDescription className="text-gray-600">
            Your booking has been confirmed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Booking ID:</span>
            <span className="text-sm font-semibold text-gray-700">{bookingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Amount Paid:</span>
            <span className="text-lg font-bold text-gray-800">Rs {totalAmount}/-</span>
          </div>
        </CardContent>
        {/* <CardFooter>
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}