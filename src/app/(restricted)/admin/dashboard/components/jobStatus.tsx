"use client"
import { ChartOptions } from 'chart.js';
import Image from 'next/image'
import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const options: ChartOptions<"doughnut"> = {
    plugins: {
        legend: {
            display: false,  // Disable legend
        },
    },
    cutout: '60%',

}

export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [40, 60],
            backgroundColor: [
                '#7B61FF',
                '#E9EBFD',
            ],
            borderColor: [
                '#7B61FF',
                '#DFE0E0',
            ],
            borderWidth: 1,
        },
    ],
};

type Props = {
}


const JobStatus = ({ }: Props) => {
    return (
        <div className='min-h-[285px] bg-white h-full w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex flex-col justify-between gap-2'>
            <div className="mb-[44px]">
                <h3 className='font-[700] text-[18px] xl:text-[22px] text-center'>Jobs Applied Status</h3>
            </div>
            <div className="flex items-end justify-between">
                <div className="w-40">
                    {/* <StatisticsChart /> */}
                    <Doughnut options={options} data={data} />
                </div>
                <div className="flex flex-col gap-4">
                    <div className='flex flex-col gap-[3px] '>
                        <div className='flex  items-center gap-1'>
                            <div className='w-[16px] h-[16px] bg-[#E9EBFD] rounded-[4px] border border-[#DFE0E0]' ></div>
                            <div className='text-[#000000] text-[18px] font-[400]'>60%</div>
                        </div>
                        <h4 className='font-[500] text-[12px] text-[#B6B6B6]'>Unsuitable </h4>
                    </div>
                    <div className='flex flex-col gap-[3px] '>
                        <div className='flex  items-center gap-1'>
                            <div className='w-[16px] h-[16px] bg-[#7B61FF] rounded-[4px] border border-[#7B61FF]' ></div>
                            <div className='text-[#000000] text-[18px] font-[400]'>40%</div>
                        </div>
                        <h4 className='font-[500] text-[12px] text-[#B6B6B6]'>Interviewed</h4>
                    </div>
                </div>
            </div>
            <div className='cursor-pointer text-[#0048FF] text-[14px] xl:text-[16px] font-[500] mt-[22px]'>
                View All Applications
            </div>
        </div>

    )
}

export default JobStatus