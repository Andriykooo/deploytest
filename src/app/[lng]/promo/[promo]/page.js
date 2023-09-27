"use client";

import { setPromo } from "@/store/actions";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page({ params }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPromo(params.promo));
    redirect("/");
  }, []);

  return null;
}
