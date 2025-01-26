"use client"
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options: ChartOptions<'bar'> = {
  plugins: {
    legend: {
      display: false,  // Disable legend
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          weight: 'bold',  // Increase font-weight for x-axis labels
        },
      },
      border:{
        width:0
      }
    },
    y: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 10000,
        callback: function(value:any) {
          if (value === 0) return '0';
          return `${value / 1000}k`;
        },
        font: {
          weight: 'bold',  // Increase font-weight for y-axis labels
        },
      },
      border:{
        width:0
      }
    },
  },
};

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dataset1=['20000','28000','15000','32000','22000','5000','22000']
const dataset2=['10000','12000','13000','13000','13000','15000','13000']

export const data:ChartData<"bar", string[], string> = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: dataset1.map((data) => data),
      backgroundColor: '#D9D9D9',
    },
    {
      label: 'Dataset 2',
      data: dataset2.map((data) => data),
      backgroundColor: '#EDECEC',
      borderRadius: {
        topLeft: 100,
        topRight: 100,
      }
    },
  ],
};

const StatisticsChart = () => {
  return (
    <Bar options={options} data={data} />
  )
}

export default StatisticsChart