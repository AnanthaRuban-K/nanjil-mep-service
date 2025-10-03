"use client"
import { SignIn } from "@clerk/nextjs"
import { Shield, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminSignInPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-600 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo-600 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-blue-800 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-lg text-blue-600 font-medium">நாஞ்சில் MEP Admin</p>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Sign In Component */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <SignIn
            path="/admin/login"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/admin/dashboard"
            forceRedirectUrl="/admin/dashboard"  // Add this
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                card: "shadow-none rounded-none border-0 bg-transparent",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldInput: "border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                footerActionLink: "text-blue-600 hover:text-blue-800 font-medium",
                dividerLine: "bg-gray-300",
                dividerText: "text-gray-500",
                socialButtonsBlockButton: "border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors",
                socialButtonsBlockButtonText: "font-medium text-gray-700",
                formHeaderTitle: "hidden",
                formHeaderSubtitle: "hidden",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                showOptionalFields: false,
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Admin access only • Contact IT support for assistance
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 Nanjil MEP Service. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}