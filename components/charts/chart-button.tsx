"use client";

import { Expand, Eye, EyeOff, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChartsContext } from "@/components/providers/charts-context-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LineHistoryChart from "@/components/charts/line-chart";
import React from "react";
import DonutHistoryChart from "@/components/charts/donut-chart";
import BarHistoryChart from "@/components/charts/bar-chart";

interface Props {
  chartId: string;
  analyses: any;
}

const ChartButton = ({ chartId, analyses }: Props) => {
  // @ts-ignore
  const { chart1, chart2, chart3, setChart1, setChart2, setChart3 } =
    useChartsContext();

  const isFullscreen =
    chartId === "1"
      ? chart1.isFullscreen
      : chartId === "2"
        ? chart2.isFullscreen
        : chart3.isFullscreen;
  const isHidden =
    chartId === "1"
      ? chart1.isHidden
      : chartId === "2"
        ? chart2.isHidden
        : chart3.isHidden;
  const handleFullscreen = () => {
    if (chartId === "1") {
      setChart1({ ...chart1, isFullscreen: !isFullscreen });
    } else if (chartId === "2") {
      setChart2({ ...chart2, isFullscreen: !isFullscreen });
    } else {
      setChart3({ ...chart3, isFullscreen: !isFullscreen });
    }
  };
  const handleHide = () => {
    if (chartId === "1") {
      setChart1({ ...chart1, isHidden: !isHidden });
    } else if (chartId === "2") {
      setChart2({ ...chart2, isHidden: !isHidden });
    } else {
      setChart3({ ...chart3, isHidden: !isHidden });
    }
  };

  return (
    <div>
      <Dialog
        open={isFullscreen}
        onOpenChange={(v) => {
          if (!v) {
            handleFullscreen();
          }
        }}
      >
        <DialogContent className="h-[90vh] w-full max-w-7xl overflow-hidden">
          {chart1.isFullscreen && <LineHistoryChart data={analyses} />}
          {chart2.isFullscreen && <DonutHistoryChart data={analyses} />}
          {chart3.isFullscreen && <BarHistoryChart data={analyses} />}
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="ghost" onClick={handleHide}>
        {isHidden ? (
          <EyeOff className={"h-4 w-4"} />
        ) : (
          <Eye className={"h-4 w-4"} />
        )}
      </Button>
      <Button size="sm" variant="ghost" onClick={handleFullscreen}>
        {isFullscreen ? (
          <Minimize className={"h-4 w-4"} />
        ) : (
          <Expand className={"h-4 w-4"} />
        )}
      </Button>
    </div>
  );
};

export default ChartButton;
