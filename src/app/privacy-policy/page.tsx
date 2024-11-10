import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-teal-600">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            At RaaziYog, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website and services.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We may collect personal information such as your name, email address, phone number, and any other information you provide when you register for our classes, subscribe to our newsletter, or contact us.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to provide and improve our services, communicate with you about your account and our offerings, and ensure a personalized experience on our platform.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns about our Privacy Policy, please contact us at:
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