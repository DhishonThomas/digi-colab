"use client"
import DashboardCard from "@/components/common/dashboardCard"
import JobStatistics from "./components/jobStatistics"
import JobStatus from "./components/jobStatus"
import CandidateSource from "./components/candidateSource"
import ScheduleTable from "./components/scheduleTable"
import useAdminAuth from "@/app/hooks/useAdminAuth"
import adminApi from "@/utils/axios_Interceptors/adminApiService"
import { useEffect } from "react"


const overView = [
    {
        title: "Total Candidates",
        value: "40,689",
        icon: "/images/dashboard/dash-users.png",
    },
    {
        title: "Total Candidates trained",
        value: "10293",
        icon: "/images/dashboard/dash-box.png",
    },
    {
        title: "Total Placed Candidates",
        value: "89,000",
        icon: "/images/dashboard/dash-graph.png",
    },
    {
        title: "Selected Job Roles",
        value: "2040",
        icon: "/images/dashboard/dash-reset.png",
    },
]
export default function page() {


async function fetchData() {
    const userCount = await adminApi.get('/count')
    const candiVolnteeCount=await adminApi.get('/volunteer-candidate-count')

    console.log("adminDash_userCount", userCount.data)
    console.log("adminDash_candiVolnteeCount", candiVolnteeCount.data)
    
}

useEffect(() => {
    fetchData()
}, [])
    const {loading}=useAdminAuth()

    if(loading)return ( <div>Loading....</div> )

    return (
        <div>
            <h3 className="text-[#333333] font-[600] text-[22px] ">Dashboard</h3>
            <div className="mt-2">
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
                    {overView.map((data, i) =>
                        <li>
                            <DashboardCard {...data} key={i} />
                        </li>
                    )}
                </ul>
            </div>
            <div className="mt-5 flex flex-col gap-[20px]">
                <ul className="grid h-full items-stretch grid-cols-1 lg:grid-cols-4 gap-[20px]">
                        <li className="col-span-3  h-full flex">
                            <JobStatistics/>
                        </li>
                        <li className=" h-full flex">
                            <JobStatus />
                        </li>
                </ul>
                <ul className="grid h-full items-stretch grid-cols-1 lg:grid-cols-4 gap-[20px]">
                        <li className=" h-full flex">
                            <CandidateSource />
                        </li>
                        <li className="col-span-3  h-full flex">
                            <ScheduleTable/>
                        </li>
                </ul>
            </div>
        </div>
    )
}