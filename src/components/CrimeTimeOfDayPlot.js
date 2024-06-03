import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function CrimeTimeOfDayPlot({ data }) {
  // Extract the data for plotting
  const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const crimeCounts = timesOfDay.map(time => {
    const entry = data.find(d => d.Time_of_day === time);
    return entry ? entry.count : 0;
  });
  const crimeTypes = timesOfDay.map(time => {
    const entry = data.find(d => d.Time_of_day === time);
    return entry ? entry.crimeType : 'No Data';
  });

  const chartData = {
    labels: timesOfDay,
    datasets: [
      {
        label: 'Crime Count',
        data: crimeCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
        text: 'Most Common Crimes by Time of Day',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function(tooltipItem) {
            return `Crime Type: ${crimeTypes[tooltipItem.dataIndex]}`;
          }
        },
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