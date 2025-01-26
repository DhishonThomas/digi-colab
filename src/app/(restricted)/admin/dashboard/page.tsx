import DashboardCard from "@/components/common/dashboardCard"
import JobStatistics from "./components/jobStatistics"
import JobStatus from "./components/jobStatus"


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
            <div className="mt-5">
                <ul className="grid grid-cols-1 lg:grid-cols-4 gap-[20px]">
                        <li className="col-span-3 max-h-[285px]">
                            <JobStatistics/>
                        </li>
                        <li className="">
                            <JobStatus />
                        </li>
                </ul>
            </div>
        </div>
    )
}