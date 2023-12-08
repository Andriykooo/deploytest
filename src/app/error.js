"use client";

import { fallbackLng } from "@/utils/constants";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function Error() {
  redirect(`/${Cookies.get("language") || fallbackLng}/error`);
}
