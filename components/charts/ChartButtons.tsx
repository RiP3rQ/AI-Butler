"use client";

import { Expand, Eye, EyeOff, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { useChartsContext } from "@/components/providers/ChartsContextProvider";

interface Props {
  chartId: string;
}

const ChartButtons = ({ chartId }: Props) => {
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