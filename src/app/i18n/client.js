// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const dictionaries = {
//   en: () => import("./locales/en.json").then((module) => module.default),
//   de: () => import("./locales/de.json").then((module) => module.default),
// };

// export const getDictionary = async (locale) => dictionaries[locale]();

// export function useClientTranslation(ns) {
//   const params = useParams();
//   const [locales, setLocales] = useState(null);

//   const initLanguage = async () => {
//     const localesData = await getDictionary(params?.lng || "en");

//     setLocales(localesData);
//   };

//   useEffect(() => {
//     initLanguage();
//   }, [params?.lng]);

//   return {
//     t: (translation) => {
//       if (Array.isArray(ns)) {
//         const [key, value] = translation.split(":");
//         return locales?.[key]?.[value];
//       }

//       return locales?.[ns]?.[translation];
//     },
//   };
// }

import { useTranslations } from "next-intl";

export const useClientTranslation = (ns) => {
  const t = (translation) => {
    if (Array.isArray(ns)) {
      const [key, value] = translation.split(":");

      const translations = useTranslations(key);

      return translations(value);
    } else {
      const translations = useTranslations(ns);

      return translations(translation);
    }
  };

  return { t };
};
