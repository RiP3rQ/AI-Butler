"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

// @ts-ignore
const CustomTooltip = ({ payload, label, active }) => {
  const dateLabel = new Date(label).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });

  if (active) {
    const analysis = payload[0].payload;
    return (
      <div
        className="p-8 custom-tooltip bg-white/5 shadow-md border border-black/10 rounded-lg backdrop-blur-md relative">
        <div
          className="absolute left-2 top-2 w-2 h-2 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="label text-sm text-black/30">{dateLabel}</p>
        <p className="intro text-xl uppercase">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

// TODO: CHART REFACTOR TO react-chartjs-2

// TODO: Main line chart on whole widht of the screen
// TODO: Then 3 smaller charts below it one pie one doughnut
// TODO: pie (negative, positive), doughnut (all scores), bar (mood)

// @ts-ignore
const LineHistoryChart = ({ data }) => {
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={data}>
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <XAxis dataKey="updatedAt" />
        <Tooltip content={<CustomTooltip payload={undefined} label={undefined} active={undefined} />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineHistoryChart;