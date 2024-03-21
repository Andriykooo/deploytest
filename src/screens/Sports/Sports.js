"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SkeletonComponent from "../../components/SkeletonComponent/SkeletonComponent";
import { Sport } from "../Sport/Sport";
import { setSelections, setSportContent, setUpdatedEvents } from "@/store/actions";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import "../Sports/Sports.css";
import { useAxiosData } from "@/hooks/useAxiosData";
import { HorseRacing } from "../HorseRacing/HorseRacing";

const Sports = ({ slug }) => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.sportContent);

  const fetchData = async () => {
    return await apiServices.get(apiUrl.GET_SPORT_CONTENT, { value: slug });
  };

  useAxiosData(fetchData, {
    onSuccess: (response) => {
      setIsLoading(false);
      dispatch(
        setSportContent({
          ...data,
          [slug]: isRacing
            ? response
            : {
                ...data[slug],
                [response.market_options[0].market_id]: response,
              },
        })
      );

      dispatch(setSelections({}));
      dispatch(setUpdatedEvents({}));
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const [isLoading, setIsLoading] = useState(!data[slug]);

  const isRacing = slug === "horseracing" || slug === "greyhoundracing";

  return isLoading ? (
    <SkeletonComponent className="px-3" />
  ) : (
    <div className="mainArticle">
      {isRacing ? (
        <HorseRacing />
      ) : (
        <Sport initialData={Object?.values(data?.[slug] || {})?.[0]} />
      )}
    </div>
  );
};

export default Sports;
