import { useEffect } from "react";
import i18next from "i18next";
import {
  reactI18nextModule,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions } from "./settings";
import { useClientPathname } from "@/hooks/useClientPathname";

i18next
  .use(reactI18nextModule)
  .use(
    resourcesToBackend((language, namespace) =>
      import(`./locales/${language}.json`).then((res) => res[namespace])
    )
  )
  .init({
    ...getOptions(),
  });

export function useClientTranslation(ns, options) {
  const { locale: lng } = useClientPathname();
  const { t, i18n } = useTranslationOrg(ns, options);

  useEffect(() => {
    if (lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n]);

  return { t, i18n };
}
