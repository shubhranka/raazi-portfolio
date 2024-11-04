import { Loader2 } from "lucide-react"

export function Redirection() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-700 mx-auto" />
        <p className="mt-4 text-lg font-medium text-gray-700">Redirecting to the payments page. Please wait...</p>
      </div>
    </div>
  )
}