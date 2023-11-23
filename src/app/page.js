import { fallbackLng } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const cookieStore = cookies();
  const language = cookieStore.get("language")?.value || fallbackLng;

  redirect(`/${language}`);
}
