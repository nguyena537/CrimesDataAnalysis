import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function IncomePlot({ data }) {
  const chartData = {
    labels: ['Income'],
    datasets: [
      {
        label: 'Income',
        data: [data.income],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
        text: 'Income Data',
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

  return <Bar options={options} data={chartData} />;
}
