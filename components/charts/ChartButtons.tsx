"use client";

import { Expand, Eye, EyeOff, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChartsContext } from "@/components/providers/ChartsContextProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LineHistoryChart from "@/components/charts/LineChart";
import React from "react";
import DonutHistoryChart from "@/components/charts/DonutChart";
import BarHistoryChart from "@/components/charts/BarChart";

interface Props {
  chartId: string;
  analyses: any;
}

const ChartButtons = ({ chartId, analyses }: Props) => {
  // @ts-ignore
  const { chart1, chart2, chart3, setChart1, setChart2, setChart3 } = useChartsContext();

  const isFullscreen = chartId === "1" ? chart1.isFullscreen : chartId === "2" ? chart2.isFullscreen : chart3.isFullscreen;
  const isHidden = chartId === "1" ? chart1.isHidden : chartId === "2" ? chart2.isHidden : chart3.isHidden;
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
        }}>
        <DialogContent className="max-w-7xl w-full h-[90vh] overflow-hidden">
          {chart1.isFullscreen && <LineHistoryChart data={analyses} />}
          {chart2.isFullscreen && <DonutHistoryChart data={analyses} />}
          {chart3.isFullscreen && <BarHistoryChart data={analyses} />}
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="ghost" onClick={handleHide}>
        {isHidden ? <EyeOff className={"w-4 h-4"} /> : <Eye className={"w-4 h-4"} />}
      </Button>
      <Button size="sm" variant="ghost" onClick={handleFullscreen}>
        {isFullscreen ? <Minimize className={"w-4 h-4"} /> : <Expand className={"w-4 h-4"} />}
      </Button>
    </div>
  );
};

export default ChartButtons;