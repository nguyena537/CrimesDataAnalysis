import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

export default function RacePlot({ data }) {
    const chartData = {
        labels: ['White', 'Black', 'Asian'],
        datasets: [
        {
            label: 'Race Percentage',
            data: [data.race_white, data.race_black, data.race_asian],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
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
            text: 'Race Percentage',
        },
        },
    };

    return <Pie options={options} data={chartData} />;
}