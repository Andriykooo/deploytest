"use client";

import { BaseLayout } from "@/layouts/baseLayout/BaseLayout";
import { ReduxLayout } from "@/store/provider";

export const Provider = ({ children }) => {
  return (
    <ReduxLayout>
      <BaseLayout>{children}</BaseLayout>
    </ReduxLayout>
  );
};
