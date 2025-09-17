import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove auth check from layout completely
  // Handle auth in individual pages instead
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Logout
          </button>
        </SignOutButton>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}