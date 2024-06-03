import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function CrimePlot({ data }) {
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
        text: 'Crime Data Plot',
        font: {
          size: 16,
        },
      },
      tooltip: {
        bodyFont: {
          size: 18,
        },
        titleFont: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 8,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const labels = data.map(d => d.crimeType);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Crime Count',
        data: data.map(d => d.crimeCount),
        backgroundColor: 'rgba(6, 178, 100, 0.5)',
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}
