"use client";

import { BaseLayout } from "@/layouts/baseLayout/BaseLayout";
import { ReduxLayout } from "@/store/provider";
import "react-toastify/dist/ReactToastify.css";

export const Provider = ({ children, header }) => {
  return (
    <ReduxLayout>
      <BaseLayout header={header}>{children}</BaseLayout>
    </ReduxLayout>
  );
};
