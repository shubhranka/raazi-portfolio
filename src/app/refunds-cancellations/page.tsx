import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function RefundsAndCancellations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-teal-600">
          <h1 className="text-3xl font-bold text-white">Refunds and Cancellations Policy</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">1. Class Cancellations</h2>
          <p className="mb-4">
            If you need to cancel a class, please notify us at least 24 hours in advance. Cancellations made with less than 24 hours' notice may be subject to a cancellation fee.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Refund Policy</h2>
          <p className="mb-4">
            For package purchases, we offer a full refund within 1 day of purchase
          </p>

          <h2 className="text-xl font-semibold mb-4">3. No-Show Policy</h2>
          <p className="mb-4">
            If you fail to show up for a scheduled class without prior notice, it will be counted as a used class from your package, and no refund will be provided.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Rescheduling</h2>
          <p className="mb-4">
            We understand that schedules can change. You may reschedule a class without penalty if done at least 12 hours before the scheduled class time.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Instructor Cancellations</h2>
          <p className="mb-4">
            In the event that an instructor needs to cancel a class, we will notify you as soon as possible and offer you the option to reschedule or receive a refund for that class.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our refund and cancellation policy, please contact us at:
            <br />
            Email: founder@raaziyog.com
            <br />
            Phone: +91 93993 28872
          </p>
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}