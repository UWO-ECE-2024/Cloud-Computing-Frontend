"use client";
import { useFlag } from "@/store";
import React from "react";

const Test = () => {
  const flag = useFlag();
  return <div>{flag.toString()}</div>;
};

export default Test;
