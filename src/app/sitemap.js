import { apiUrl } from "@/utils/constants";

export default async function sitemap() {
  const pagesResponse = await fetch(apiUrl.GET_MAIN_MENU);
  const onboardingResponse = await fetch(apiUrl.ON_BOARDING);
  const sidebarLeftResponse = await fetch(apiUrl.GET_SIDEBAR_LEFT);

  const pages = await pagesResponse.json();
  const onboarding = await onboardingResponse.json();
  const sidebarLeft = await sidebarLeftResponse.json();

  const baseUrl = process?.env?.NEXT_PUBLIC_APP_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1,
    },
    ...onboarding.languages.flatMap((language) => {
      return [
        {
          url: `${baseUrl}/${language.code2}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.9,
        },
        ...sidebarLeft.map((sport) => {
          return {
            url: `${baseUrl}/${language.code2}/sport/${sport.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          };
        }),
        ...pages.map((page) => {
          return {
            url: `${baseUrl}/${language.code2}${page.path}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          };
        }),
      ];
    }),
  ];
}
