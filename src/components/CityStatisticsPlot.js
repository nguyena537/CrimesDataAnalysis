import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function CityStatisticsPlot({ data }) {
  const crimeCountData = {
    labels: ['Crime Count'],
    datasets: [
      {
        label: 'Crime Count',
        data: [data.crime_count],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const avgIncomeData = {
    labels: ['Average Income'],
    datasets: [
      {
        label: 'Average Income',
        data: [data.avg_income],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // Calculate the total percentage of known races
  const totalPercentage = data.avg_race_white + data.avg_race_black + data.avg_race_asian;
  
  // Calculate the percentage for 'Other'
  const otherPercentage = 100 - totalPercentage;
  const racialDemographicsData = {
    labels: ['White', 'Black', 'Asian', 'Other'],
    datasets: [
      {
        label: 'Average Racial Demographics',
        data: [data.avg_race_white, data.avg_race_black, data.avg_race_asian, otherPercentage],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)'
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

  return (
    <div className="city-statistics-container">
      <div className="city-statistics-column-crime">
        <h3>Crime Count</h3>
        <Bar options={{ ...options, title: { display: true, text: 'Crime Count' } }} data={crimeCountData} />
      </div>
      <div className="city-statistics-column-income">
        <h3>Average Income</h3>
        <Bar options={{ ...options, title: { display: true, text: 'Average Income' } }} data={avgIncomeData} />
      </div>
      <div className="city-statistics-column-race">
        <div className="race-pie-chart">
        <h3>Racial Demographics</h3>
        <Pie options={{ ...options, title: { display: true, text: 'Racial Demographics for city' } }} data={racialDemographicsData} />
        </div>
      </div>
    </div>
  );
}