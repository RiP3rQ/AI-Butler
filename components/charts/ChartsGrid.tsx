"use client";

import { Card } from "@/components/ui/card";
import ChartButtons from "@/components/charts/ChartButtons";
import { Separator } from "@/components/ui/separator";
import LineHistoryChart from "@/components/charts/LineChart";
import DonutHistoryChart from "@/components/charts/DonutChart";
import BarHistoryChart from "@/components/charts/BarChart";
import React from "react";
import { useChartsContext } from "@/components/providers/ChartsContextProvider";

interface Props {
  analyses: any;
}

const ChartsGrid = ({ analyses }: Props) => {
  // @ts-ignore
  const { chart1, chart2, chart3 } = useChartsContext();

  return (
    <div className={"space-y-2"}>
      <Card>
        <div
          className={
            "my-1 flex h-6 w-full items-center justify-between px-2 text-center font-bold text-black dark:text-muted-foreground"
          }
        >
          Sentiment Analysis History
          <ChartButtons chartId={"1"} analyses={analyses} />
        </div>
        <Separator />
        <div className={`w-full h-96 ${chart1.isHidden ? "hidden" : ""}`}>
          <LineHistoryChart data={analyses} />
        </div>
      </Card>
      <div className={"grid grid-cols-2 gap-2"}>
        <Card>
          <div
            className={
              "my-1 flex h-6 w-full items-center justify-between px-2 text-center font-bold text-black dark:text-muted-foreground"
            }
          >
            Positive vs Negative Sentiment
            <ChartButtons chartId={"2"} analyses={analyses} />
          </div>
          <Separator />
          <div className={`w-full h-56 overflow-hidden ${chart2.isHidden ? "hidden" : ""}`}>
            <DonutHistoryChart data={analyses} />
          </div>
        </Card>
        <Card>
          <div
            className={
              "my-1 flex h-6 w-full items-center justify-between px-2 text-center font-bold text-black dark:text-muted-foreground"
            }
          >
            Sentiment Distribution
            <ChartButtons chartId={"3"} analyses={analyses} />
          </div>
          <Separator />
          <div className={`w-full h-56 overflow-hidden ${chart3.isHidden ? "hidden" : ""}`}>
            <BarHistoryChart data={analyses} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartsGrid;