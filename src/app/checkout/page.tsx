import { CalendarDays, Clock, CreditCard, Mail, Phone, User, Users, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

// Mock data for the checkout confirmation
const checkoutData = {
  fullName: "Priya Sharma",
  phoneNumber: "+91 98765 43210",
  email: "priya.sharma@example.com",
  courseType: "Group",
  courseName: "Hatha Yoga Basics",
  courseTiming: "Mon, Wed, Fri 7:00 AM",
  courseFees: 50
}

export default function CheckoutConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 p-6 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <div className="inline-block bg-white rounded-full p-2 shadow-lg mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
              alt="RaaziYog Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Checkout Confirmation</h1>
          <p className="text-teal-600">You're one step away from inner peace</p>
        </header>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-teal-600 text-white">
            <CardTitle className="text-2xl font-semibold flex items-center justify-center">
              {/* <CheckCircle className="mr-2 h-6 w-6" /> */}
              Enrollment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center border-b border-teal-100 pb-2">
                <User className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Full Name</p>
                  <p className="font-semibold text-teal-900">{checkoutData.fullName}</p>
                </div>
              </div>
              <div className="flex items-center border-b border-teal-100 pb-2">
                <Phone className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Phone Number</p>
                  <p className="font-semibold text-teal-900">{checkoutData.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center border-b border-teal-100 pb-2">
                <Mail className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Email</p>
                  <p className="font-semibold text-teal-900">{checkoutData.email}</p>
                </div>
              </div>
              <div className="flex items-center border-b border-teal-100 pb-2">
                <Users className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Course Type</p>
                  <p className="font-semibold text-teal-900">{checkoutData.courseType} Course</p>
                </div>
              </div>
              <div className="flex items-center border-b border-teal-100 pb-2">
                <CalendarDays className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Course Name</p>
                  <p className="font-semibold text-teal-900">{checkoutData.courseName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Course Timing</p>
                  <p className="font-semibold text-teal-900">{checkoutData.courseTiming}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-teal-50 p-6 flex flex-col items-center">
            <div className="text-center mb-4">
              <p className="text-teal-600 font-semibold">Total Course Fees</p>
              <p className="text-4xl font-bold text-teal-800">${checkoutData.courseFees}</p>
            </div>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 transform hover:scale-105">
              <CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <Button variant="outline" className="px-6 hover:bg-white/50 transition-all duration-300">
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  )
}