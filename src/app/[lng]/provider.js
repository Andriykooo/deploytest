"use client";

import { BaseLayout } from "@/layouts/baseLayout/BaseLayout";
import { ReduxLayout } from "@/store/provider";
import { languages } from "../i18n/settings";
import { redirect, usePathname } from "next/navigation";

export const Provider = ({ children }) => {
  const pathname = usePathname();

  if (!languages.some((lang) => pathname.startsWith(`/${lang}`))) {
    redirect(`/en${pathname}`);
  }

  return (
    <ReduxLayout>
      <BaseLayout>{children}</BaseLayout>
    </ReduxLayout>
  );
};
