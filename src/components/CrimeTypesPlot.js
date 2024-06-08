import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CrimeTypesPlot = ({ data }) => {
  const chartData = {
    labels: data.map(crime => crime.crimeType),
    datasets: [
      {
        label: 'Crime Count',
        data: data.map(crime => crime.crimeCount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
		  font: {
            size: 7, // Adjust the font size for the x-axis labels
          },
        },
        title: {
          display: true,
          text: 'Crime Types',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Crime Count',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CrimeTypesPlot;
