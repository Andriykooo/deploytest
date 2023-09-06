"use client";

import { BaseLayout } from "@/layouts/baseLayout/BaseLayout";
import { ReduxLayout } from "@/store/provider";
import "react-toastify/dist/ReactToastify.css";

export const Provider = ({ children, header }) => {
  return (
    <ReduxLayout>
      <BaseLayout
        header={header.map((page, index) => ({
          ...page,
          id: index + 1,
        }))}
      >
        {children}
      </BaseLayout>
    </ReduxLayout>
  );
};
