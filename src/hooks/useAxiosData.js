import { useEffect, useState } from "react";
import { isObject } from "@/utils/global";

export const useAxiosData = (query, options, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTabFocused, setIsTabFocused] = useState(
    isObject(options) && Object.hasOwn(options, "enabled")
      ? options.enabled
      : true
  );

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setIsTabFocused(false);
    } else {
      setIsTabFocused(true);
    }
  };

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
    if (isTabFocused) {
      fetchData();
    }
  }, [isTabFocused, ...dependencies]);

  useEffect(() => {
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchData]);

  return { data, isLoading, error };
};
