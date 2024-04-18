import { LocaleContext } from "@/context/locale";
import { useContext } from "react";

const getValueFromString = (str, obj, dynamic) => {
  const keys = str.split(".");

  let value = obj;
  for (const key of keys) {
    value = value[key];
    if (!value === undefined) {
      return undefined;
    }
  }

  if (dynamic) {
    Object.entries(dynamic).map(([k, v]) => {
      value = value.replace(`{${k}}`, v);
    });
  }

  return value;
};

export const useTranslations = (group) => {
  const { localeData } = useContext(LocaleContext);

  const locale = group ? localeData[group] : localeData;

  return (path, dynamic) => {
    return getValueFromString(path, locale, dynamic);
  };
};
