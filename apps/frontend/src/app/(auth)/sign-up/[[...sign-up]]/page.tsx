// File: app/sign-up/page.tsx - Simple Professional Signup Page
"use client"
import { SignUp } from "@clerk/nextjs"
import { ArrowLeft, Wrench } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Wrench className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          நாஞ்சில் MEP Services
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          புதிய கணக்கு உருவாக்குங்கள்
        </p>
        <p className="text-center text-sm text-blue-600">
          Create Your Account
        </p>
      </div>

      {/* Back Button */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>வீட்டிற்கு திரும்பு • Back to Home</span>
        </button>
      </div>

      {/* Signup Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/"
            appearance={{
              elements: {
                // Main form styling
                formButtonPrimary: 
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 w-full",
                
                // Card container
                card: "shadow-none bg-transparent p-0 w-full",
                
                // Header elements
                headerTitle: "text-2xl font-bold text-gray-900 text-center",
                headerSubtitle: "text-gray-600 text-center mt-2",
                
                // Form fields
                formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
                formFieldInput: 
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                
                // Links and buttons
                footerActionLink: "text-blue-600 hover:text-blue-800 font-medium",
                
                // Social buttons
                socialButtonsBlockButton: 
                  "w-full border border-gray-300 hover:border-gray-400 rounded-lg py-2 px-4 transition-colors",
                socialButtonsBlockButtonText: "font-medium text-gray-700",
                
                // Dividers
                dividerLine: "bg-gray-300",
                dividerText: "text-gray-500 text-sm",
                
                // Form container
                form: "space-y-4",
                
                // Remove default headers since we have custom ones
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

        {/* Bottom Links */}
        <div className="mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ஏற்கனவே கணக்கு உள்ளதா?
            </p>
            <button
              onClick={() => router.push('/sign-in')}
              className="mt-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              உள்நுழையுங்கள் • Sign In
            </button>
          </div>
        </div>

        {/* Benefits */}
        
      </div>
    </div>
  )
}