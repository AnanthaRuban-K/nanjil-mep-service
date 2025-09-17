// SOLUTION 2: Keep your current file and just change routing to "hash"
// apps/frontend/src/app/admin/login/page.tsx

"use client";

import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignIn
        // Remove the path prop and set routing to hash
        routing="hash"
        signUpUrl="/sign-up"
        afterSignInUrl="/check-role"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white font-medium",
            card: "shadow-xl rounded-xl",
          },
        }}
      />
    </div>
  );
}