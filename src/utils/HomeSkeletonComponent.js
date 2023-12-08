"use client";

import React, { Fragment } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { betGroupLinks, eventAtSlider, liveGamesData } from "./constants";
import "../screens/Home/Home.css";

const sports = [
  "Football",
  "Tennis",
  "American Football",
  "Basketball",
  "Boxing",
  "Ice Hockey",
  "Cricket",
  "Darts",
  "Horse Racing",
];

const HomeSkeletonComponent = ({ isLoading }) => {
  const isMobile = useSelector((state) => state.setMobile);

  let counter = 0;
  const maxCounter = betGroupLinks.length - 1;

  return <div className="home-container-skeleton"></div>;
};

export default HomeSkeletonComponent;
