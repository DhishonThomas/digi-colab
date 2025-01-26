import Image from 'next/image'
import React from 'react'
import StatisticsChart from './statisticsChart'

type Props = {
}
const JobStatistics = ({ }: Props) => {
    return (
        <div className='w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex flex-col gap-2'>
            <div className="flex items-start justify-between w-[90%]">
                <h3 className='font-[700] text-[18px] '>JOB STATISTICS</h3>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-[6px] text-[10px] font-[500]">
                        <div className="">Job View</div>
                        <div className="w-[9px] h-[9px] rounded-full bg-[#B0B0B020]"></div>
                    </div>
                    <div className="flex items-center gap-[6px] text-[10px] font-[500]">
                        <div className="">Job applied</div>
                        <div className="w-[9px] h-[9px] rounded-full bg-[#2A2A2A20]"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-between gap-20">
                <div className="w-full height-[100px]">
                    <StatisticsChart />
                </div>
                <div className="flex flex-col items-end gap-4">
                    <div className='min-h-[75px] min-w-[158px] w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex justify-between items-start'>
                        <div className='flex flex-col gap-[12px]'>
                            <h4 className='font-[600] text-[12px] text-[#688086]'>Job Views</h4>
                            <div className='text-[#B56365] text-[13px] font-[700]'>2040</div>
                        </div>
                        <div className='w-[21px] h-[19px] bg-[#B88A004D] rounded-[8px]' ></div>
                    </div>
                    <div className='min-h-[75px] min-w-[158px] w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex justify-between items-start'>
                        <div className='flex flex-col gap-[12px]'>
                            <h4 className='font-[600] text-[12px] text-[#688086]'>Job Applied</h4>
                            <div className='text-[#B56365] text-[13px] font-[700]'>2040</div>
                        </div>
                        <div className='w-[21px] h-[19px] bg-[#7AB8004D] rounded-[8px]' ></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default JobStatistics