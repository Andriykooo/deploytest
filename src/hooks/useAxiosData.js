import { useEffect, useState } from "react";
import { isObject } from "@/utils/global";

export const useAxiosData = (query, options, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await query();
      setData(response);
      setIsLoading(false);

      if (options?.onSuccess) {
        options.onSuccess(response);
      }
    } catch (error) {
      setError(error);
      setIsLoading(false);

      if (options?.onError) {
        options.onError(error);
      }
    }
  };

  useEffect(() => {
    const enabled =
      isObject(options) && Object.hasOwn(options, "enabled") && options.enabled;

    if (!enabled) {
      fetchData();
    }

    window.addEventListener("focus", fetchData);

    return () => {
      window.removeEventListener("focus", fetchData);
    };
  }, dependencies);

  return { data, isLoading, error };
};
