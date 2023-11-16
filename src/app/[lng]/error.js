"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Error() {
  const router = useRouter();

  useLayoutEffect(() => {
    process.env.NODE_ENV === "production" && router.replace("/error");
  }, []);
}
