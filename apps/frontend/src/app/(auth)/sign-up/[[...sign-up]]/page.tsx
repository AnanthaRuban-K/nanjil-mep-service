"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-green-600 hover:bg-green-700 text-white font-medium",
            card: "shadow-xl rounded-xl",
          },
        }}
      />
    </div>
  );
}
