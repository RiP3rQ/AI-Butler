"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

const BarHistoryChart = ({ data }: any) => {
  let colors = [];

  for (let i = 0; i < 41; i++) {
    let r = Math.floor(Math.random() * 256); // Random between 0-255
    let g = Math.floor(Math.random() * 256); // Random between 0-255
    let b = Math.floor(Math.random() * 256); // Random between 0-255
    colors.push("rgb(" + r + ", " + g + ", " + b + ")");
  }

  // Create an array of labels from -20 to 20 and parse values to string
  const labels = Array.from({ length: 41 }, (_, i) => (i - 20).toString());

  console.log(labels);
  console.log(data);

  const chartData = {
    labels: labels,
    datasets: [{
      label: "Count",
      // map props data to the labels array when the sentimentScore is equal to the label value
      data: labels.map((label) => data.filter((d: any) => d.sentimentScore === label).length),
      backgroundColor: colors,
      hoverOffset: 4
    }]
  };

  console.log(chartData);

  if (!data) return null;

  if (!chartData) return null;

  return <div className={"h-full w-full flex items-center justify-center"}>
    <Bar options={options} data={chartData} />
  </div>;
};

export default BarHistoryChart;