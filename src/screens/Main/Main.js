"use client";

import { redirect, usePathname } from "next/navigation";

export const Main = () => {
  const pathname = usePathname();

  redirect(`/en${pathname}`);

  return null;
};
