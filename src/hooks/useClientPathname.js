import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useClientPathname = () => {
  const pathname = usePathname();

  const data = useMemo(() => {
    // eslint-disable-next-line
    const [_, locale, ...rest] = pathname.split("/");

    return {
      locale,
      pathname: `/${rest.join("/")}`,
    };
  }, [pathname]);

  return data;
};
