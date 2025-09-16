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

    // 👇 Example: role fetch from Clerk metadata
    const role = user.publicMetadata.role as string;

    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/"); // non-admin → homepage
    }
  }, [user, isLoaded, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
