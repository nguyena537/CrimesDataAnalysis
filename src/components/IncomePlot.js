import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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
        },
        title: {
          display: true,
          text: 'Income Data',
        },
      },
    };
  
    return <Bar options={options} data={chartData} />;
  }