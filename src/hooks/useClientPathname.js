import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useClientPathname = () => {
  const pathname = usePathname();

  const data = useMemo(() => {
    const [_, locale, ...rest] = pathname.split("/");

    return {
      locale,
      pathname: `/${rest.join("/")}`,
    };
  }, [pathname]);

  return data;
};
