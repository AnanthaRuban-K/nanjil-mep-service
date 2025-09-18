// apps/frontend/src/app/admin/layout.tsx
'use client'
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/admin/login");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          {user && (
            <p className="text-sm text-gray-600">
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
            </p>
          )}
        </div>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </SignOutButton>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}