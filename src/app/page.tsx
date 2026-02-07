"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/generator");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-pt-muted">Redirecting...</p>
    </div>
  );
}
