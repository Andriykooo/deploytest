export const fallbackLng = "en";
export const languages = [fallbackLng, "de"];
export const defaultNS = "common";
export const cookieName = "language";

export function getOptions() {
  return {
    supportedLngs: languages,
    fallbackNS: defaultNS,
    defaultNS,
    ns: [defaultNS],
  };
}
