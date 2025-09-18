import { currentUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  // Check if user is admin (matching your existing logic)
  const userRole = user.publicMetadata?.role as string;
  if (userRole !== 'admin' && userRole !== 'ADMIN') {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">நாஞ்சில் MEP நிர்வாகம்</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
          </span>
          <SignOutButton>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              வெளியேறு / Logout
            </button>
          </SignOutButton>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}