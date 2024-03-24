"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      align: "center" as const
    },
    tooltip: {
      bodyAlign: "center" as const
    }
  }
};

const DonutHistoryChart = ({ data }: any) => {
  const chartData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Count",
        data: [data.filter((record: any) => record.sentimentScore > 0).length, data.filter((record: any) => record.sentimentScore < 0).length],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  console.log(chartData);

  if (!data) return null;

  if (!chartData) return null;

  return <div className={"h-full w-full flex items-center justify-center"}>
    <Doughnut options={options} data={chartData} />
  </div>;
};

export default DonutHistoryChart;