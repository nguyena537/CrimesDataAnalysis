import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function RacePlot({ data }) {
  // Calculate the total percentage of known races
  const totalPercentage = data.race_white + data.race_black + data.race_asian;
  
  // Calculate the percentage for 'Other'
  const otherPercentage = 100 - totalPercentage;

  // Define the chart data
  const chartData = {
    labels: ['White', 'Black', 'Asian', 'Other'],
    datasets: [
      {
        label: 'Race Percentage',
        data: [data.race_white, data.race_black, data.race_asian, otherPercentage],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', 
          'rgba(255, 159, 64, 0.6)', 
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
      },
    ],
  };

  // Define the chart options
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
        text: 'Race Percentage',
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
  };

  // Render the Pie chart
  return <Pie options={options} data={chartData} />;
}
