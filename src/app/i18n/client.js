// import { useEffect } from "react";
// import i18next from "i18next";
// import {
//   initReactI18next,
//   useTranslation as useTranslationOrg,
// } from "react-i18next";
// import { useClientPathname } from "@/hooks/useClientPathname";

// i18next
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: {
//         translation: "sdas",
//       },
//     },
//     lng: "en",
//   });

export function useClientTranslation(ns, options) {
  // const { locale: lng } = useClientPathname();
  // const { t, i18n } = useTranslationOrg(ns, options);

  // useEffect(() => {
  //   if (lng !== i18n.language) {
  //     i18n.changeLanguage(lng);
  //   }
  // }, [lng, i18n]);
  const t = () => "dcfvgbhuijkom";

  return { t };
}
