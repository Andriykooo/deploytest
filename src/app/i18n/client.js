import { useEffect } from "react";
import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions, languages } from "./settings";
import { useClientPathname } from "@/hooks/useClientPathname";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) =>
      import(`./locales/${language}.json`).then((res) => res[namespace])
    )
  )
  .init({
    ...getOptions(),
    preload: runsOnServerSide ? languages : [],
  });

export function useClientTranslation(ns, options) {
  // const { locale: lng } = useClientPathname();
  // const { t, i18n } = useTranslationOrg(ns, options);

  // useEffect(() => {
  //   if (lng !== i18n.language) {
  //     i18n.changeLanguage(lng);
  //   }
  // }, [lng, i18n]);

  const t = () => "qweqweqwe";

  return { t };
}
