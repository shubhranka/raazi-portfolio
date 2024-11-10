import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-teal-600">
          <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using RaaziYog's website and services, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you may not use our services.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Use of Services</h2>
          <p className="mb-4">
            You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Intellectual Property</h2>
          <p className="mb-4">
            All content on the RaaziYog website, including text, graphics, logos, and images, is the property of RaaziYog and is protected by copyright and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Limitation of Liability</h2>
          <p className="mb-4">
            RaaziYog shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Modifications to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms and Conditions at any time. Your continued use of our services after any changes indicates your acceptance of the modified terms.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
          <p className="mb-4">
            These Terms and Conditions are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
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