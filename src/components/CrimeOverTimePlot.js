import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function CrimeOverTimePlot({ data }) {
  const years = Object.keys(data);
  const crimeCounts = Object.values(data);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Crimes',
        data: crimeCounts,
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Total Crimes Over Years',
        font: {
          size: 16,
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
