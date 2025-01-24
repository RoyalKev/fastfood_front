import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StatistiquesAdmin = ({ data }) => {

        const chartData = {
            labels: data.map(item => item.month),
            datasets: [
              {
                label: 'Tâches créées',
                data: data.map(item => item.totalmois),
                backgroundColor: 'rgba(0, 143, 251, 0.4)',
                borderColor: 'rgba(0, 143, 251, 1)',
                borderWidth: 1,
                borderRadius: 5,
              },
              {
                label: 'Tâches exécutées',
                data: data.map(item => item.totalexecute),
                backgroundColor: 'rgba(91, 175, 30, 0.4)',
                borderColor: 'rgba(91, 175, 30, 1)',
                borderWidth: 1,
                borderRadius: 5,
              },
            ],
          };

          const options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            layout: {
                padding: 5,
              },
            barThickness: 10
          };




          return <Bar data={chartData} options={options} />;
}

export default StatistiquesAdmin