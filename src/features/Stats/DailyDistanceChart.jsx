import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DailyDistanceChart({ data }) {
  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };
  return <Line options={options} data={data} />;
}

export default DailyDistanceChart;
