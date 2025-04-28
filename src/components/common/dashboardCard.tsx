import Image from 'next/image'
import React from 'react'

type Props = {
    icon?:string,
    title?:string,
    value:number|string
}
const DashboardCard = ({icon,title,value}:Props) => {
    return (
        <div className='min-h-[113px] bg-white w-full rounded-[10px] shadow-[1.22px_2.44px_7.32px_0px_rgba(6,44,58,0.25)] p-[20px] flex justify-between items-start'>
            <div className='flex flex-col gap-[12px]'>
                <h4 className='font-[600] text-[12px] text-[#688086]'>{title}</h4>
                <div className='text-[#B56365] text-[20px] font-[700]'>{value}</div>
            </div>
            {icon&&<div className='w-[32px] h-[28px] flex items-center justify-center'>
                <Image alt="" src={icon} width={32} height={28} />
            </div>}
        </div>
    )
}

export default DashboardCard