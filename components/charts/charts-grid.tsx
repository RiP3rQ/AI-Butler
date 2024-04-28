"use client";

import { Card } from "@/components/ui/card";
import ChartButton from "@/components/charts/chart-button";
import { Separator } from "@/components/ui/separator";
import LineHistoryChart from "@/components/charts/line-chart";
import DonutHistoryChart from "@/components/charts/donut-chart";
import BarHistoryChart from "@/components/charts/bar-chart";
import React from "react";
import { useChartsContext } from "@/components/providers/charts-context-provider";

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
          <ChartButton chartId={"1"} analyses={analyses} />
        </div>
        <Separator />
        <div className={`h-96 w-full ${chart1.isHidden ? "hidden" : ""}`}>
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
            <ChartButton chartId={"2"} analyses={analyses} />
          </div>
          <Separator />
          <div
            className={`h-56 w-full overflow-hidden ${chart2.isHidden ? "hidden" : ""}`}
          >
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
            <ChartButton chartId={"3"} analyses={analyses} />
          </div>
          <Separator />
          <div
            className={`h-56 w-full overflow-hidden ${chart3.isHidden ? "hidden" : ""}`}
          >
            <BarHistoryChart data={analyses} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartsGrid;
