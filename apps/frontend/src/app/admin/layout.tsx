import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Link
          href="/admin/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

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
