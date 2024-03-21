import { useParams, useRouter } from "next/navigation";

export const useCustomRouter = () => {
  const router = useRouter();
  const params = useParams();

  return {
    ...router,
    push: (path) => {
      router.push(`/${params.lng}${path}`);
    },
    replace: (path) => {
      router.replace(`/${params.lng}${path}`);
    },
  };
};
