"use client"
import { SignIn } from "@clerk/nextjs"
import { User, ArrowLeft, Wrench, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-600 rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-yellow-600 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>வீட்டிற்கு திரும்பு (Back to Home)</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="bg-blue-500 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">உள்நுழை</h1>
          <p className="text-lg text-blue-600 font-medium">Sign In</p>
          <p className="text-gray-600">Access your service bookings and history</p>
        </div>

        {/* Sign In Component */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                card: "shadow-none rounded-none border-0 bg-transparent p-8",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldInput: "border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors",
                footerActionLink: "text-green-600 hover:text-green-800 font-medium",
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

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">மின்சாரம்</p>
            <p className="text-xs text-gray-600">Electrical</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-800">குழாய்</p>
            <p className="text-xs text-gray-600">Plumbing</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            புதிய வாடிக்கையாளரா? • New customer?
          </p>
          <button
            onClick={() => router.push('/sign-up')}
            className="text-green-600 hover:text-green-800 font-medium text-sm mt-1"
          >
            பதிவு செய்யுங்கள் (Sign Up)
          </button>
        </div>
      </div>
    </div>
  )
}