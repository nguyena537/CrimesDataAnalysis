import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function CrimeTimeOfDayPlot({ data }) {
  const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const crimeCounts = timesOfDay.map(time => data[time.toLowerCase()] || 0);

  const chartData = {
    labels: timesOfDay,
    datasets: [
      {
        label: 'Crimes',
        data: crimeCounts,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
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
        text: 'Crimes by Time of Day',
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
