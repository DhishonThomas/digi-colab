import Image from 'next/image'
import React from 'react'
import StatisticsChart from './statisticsChart'

type Props = {
}
const tableDate = [
    { name: "Joel", designation: "Designer", time: "10:30", status: "Completed" },
    { name: "Sooraj", designation: "Plumber", time: "12:00", status: "Incomplete" },
    { name: "Jeseel", designation: "Sales man", time: "01:30", status: "Processing" },
    { name: "Afsal", designation: "Chef", time: "02:30", status: "Processing" },
]
const ScheduleTable = ({ }: Props) => {
    return (
        <div className='w-full bg-white h-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] py-[20px] px-[36px] flex flex-col gap-2'>
            <div className="flex items-start justify-between w-full]">
                <h3 className='font-[600] text-[18px] xl:text-[22px]'>INTERVIEW SCHEDULE</h3>
                <div className="flex flex-col items-end">
                    Today
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="">
                        <tr>
                            <th className="pe-6 py-3 text-start text-[1rem] font-medium text-[#000000] uppercase tracking-wider">
                                Contact Name
                            </th>
                            <th className="px-6 py-3 text-start text-[1rem] font-medium text-[#000000] uppercase tracking-wider">
                                Designation
                            </th>
                            <th className="px-6 py-3 text-start text-[1rem] font-medium text-[#000000] uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-start text-[1rem] font-medium text-[#000000] uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white  text-[1rem]">
                        {tableDate.map((data, index) => (
                            <tr key={index} className="hover:bg-gray-50 text-[#000] font-[300]">
                                <td className="pe-6 py-4 whitespace-nowrap">
                                    <div className="">{data.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className=" ">{data.designation}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className=" ">{data.time}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className=" ">{data.status}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ScheduleTable