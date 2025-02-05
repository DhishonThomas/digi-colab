"use client"
import Image from 'next/image'
import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions<"doughnut"> = {
    plugins: {
        legend: {
            display: false,  // Disable legend
        },
        tooltip: {
            enabled: false
        }
    },
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: false,
    rotation: -80,
    circumference: 360,

}

interface CircularProgressProps {
    value?: number;
    title?: string;
    onPrevious?: () => void;
    onNext?: () => void;
}
const chartData: ChartData<'doughnut'> = {
    datasets: [{
        data: [23, 17, 17, 42],
        backgroundColor: [
            '#F68D2B',  // Orange
            '#F4A79D',  // Light salmon
            '#344BFD',  // Blue
            '#FFD200',  // Yellow
        ],
        borderWidth: 6,
        borderRadius:100,
        spacing: 1,
        
        //   cutout: '75%',
    }],
};

const CandidateSource: React.FC<CircularProgressProps> = ({
    value = 45623,
    title = "Candidate source",
    onPrevious,
    onNext,
}) => {
    return (
        <div className='min-h-[285px] bg-white h-full w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex flex-col justify-between gap-2'>
           <div className="flex items-center justify-between mb-4">
        <div 
          className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
          onClick={onPrevious}
        >prev</div>
        <h2 className="text-[#2E2E30] text-[12px] xl:text-[16px] font-[700]">{title}</h2>
        <div
          className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
          onClick={onNext}
        >next</div>
      </div>

      <div className="relative h-48 w-48 mx-auto">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-gray-800">
            {value.toLocaleString()}
          </span>
          <span className="text-3xl font-semibold text-gray-800">
            {'-'.repeat(value.toLocaleString().length)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">You are doing good!</span>
          <span className="text-gray-500 text-sm">You almost reached your goal</span>
        </div>
      </div>
        </div>

    )
}

export default CandidateSource