import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ParticipantExpenseChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false, // Il titolo è già nel componente Stats
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export default ParticipantExpenseChart;
