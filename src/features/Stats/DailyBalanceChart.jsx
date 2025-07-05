import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DailyBalanceChart({ data }) {
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y_hours: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Ore",
        },
      },
      y_activities: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "N° Attività",
        },
        grid: {
          drawOnChartArea: false, // only draw grid for the first Y axis
        },
        ticks: {
          stepSize: 1, // Ensure integer steps for activity count
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
}

export default DailyBalanceChart;
