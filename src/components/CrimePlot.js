import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function CrimePlot({ data }) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Crime Data Plot',
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
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  
    return <Bar options={options} data={chartData} />;
  }