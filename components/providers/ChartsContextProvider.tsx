"use client";

import { useState, createContext, useContext } from "react";

// @ts-ignore
const ChartButtonsContext = createContext();

interface Props {
  children: React.ReactNode;
}

export const ChartsContextProvider = ({ children }: Props) => {
  const [chart1, setChart1] = useState({ isHidden: false, isFullscreen: false });
  const [chart2, setChart2] = useState({ isHidden: false, isFullscreen: false });
  const [chart3, setChart3] = useState({ isHidden: false, isFullscreen: false });

  return (
    <ChartButtonsContext.Provider value={{ chart1, chart2, chart3, setChart1, setChart2, setChart3 }}>
      {children}
    </ChartButtonsContext.Provider>
  );
};

export const useChartsContext = () => useContext(ChartButtonsContext);