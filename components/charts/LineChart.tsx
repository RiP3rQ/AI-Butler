"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

// Main line chart on whole widht of the screen
// Then 3 smaller charts below it one pie one doughnut
// pie (negative, positive), doughnut (all scores), bar (mood)

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
    title: {
      display: true,
      text: "Sentiment Analysis",
      align: "center" as const
    },
    tooltip: {
      bodyAlign: "center" as const
    }
  }
};

const LineHistoryChart = ({ data }: any) => {
  const formatDate = (date: string) => {
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  };

  const labels = data.map((record: any) => formatDate(record.updatedAt));
  const chartData = {
    labels,
    datasets: [
      {
        label: "Sentiment",
        data: data.map((record: any) => record.sentimentScore),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)"
      }
    ]
  };

  console.log(chartData);

  if (!data) return null;

  if (!chartData) return null;

  return <div className={"w-full h-full"}>

    <Line options={options} data={chartData} />
  </div>;
};

export default LineHistoryChart;