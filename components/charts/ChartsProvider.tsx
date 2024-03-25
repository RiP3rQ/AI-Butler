"use client";

import React from "react";
import { ChartsContextProvider } from "@/components/providers/ChartsContextProvider";
import ChartsGrid from "@/components/charts/ChartsGrid";

interface Props {
  analyses: any;
}

const ChartsProvider = ({ analyses }: Props) => {
  return (
    <ChartsContextProvider>
      <ChartsGrid analyses={analyses} />
    </ChartsContextProvider>
  );
};

export default ChartsProvider;
