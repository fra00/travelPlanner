import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DailyCostChart({ data }) {
  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };
  return <Bar options={options} data={data} />;
}

export default DailyCostChart;
