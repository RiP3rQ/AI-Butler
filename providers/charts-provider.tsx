"use client";

import React from "react";
import { ChartsContextProvider } from "@/providers/charts-context-provider";
import ChartsGrid from "@/components/charts/charts-grid";

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
