"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CheckRolePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/admin/login");
      return;
    }

    // Check role from Clerk metadata
    const role = user.publicMetadata?.role as string;

    if (role === "ADMIN" || role === "admin") {
      router.push("/admin/dashboard");
    } else {
      // Non-admin users go to homepage
      router.push("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center mt-10">Redirecting...</p>
    </div>
  );
}