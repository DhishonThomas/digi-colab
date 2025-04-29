"use client";

import DashboardCard from "@/components/common/dashboardCard";
import JobStatistics from "./components/jobStatistics";
import JobStatus from "./components/jobStatus";
import CandidateSource from "./components/candidateSource";
import ScheduleTable from "./components/scheduleTable";
import useAdminAuth from "@/app/hooks/useAdminAuth";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import { useEffect, useState } from "react";

interface OverviewItem {
  key: string;
  title: string;
  value: string | number;
  icon: string;
}

const defaultOverviewData: OverviewItem[] = [
  {
    key: "userCount",
    title: "Total Candidates",
    value: 0,
    icon: "/images/dashboard/dash-users.png",
  },
  {
    key: "trainedCount",
    title: "Total Candidates trained",
    value: 0,
    icon: "/images/dashboard/dash-box.png",
  },
  {
    key: "volunteerCount",
    title: "Total Volunteers",
    value: 0,
    icon: "/images/dashboard/dash-graph.png",
  },
  {
    key: "selectedJobRole", // corrected to match mapping condition
    title: "Selected Job Roles",
    value: 0,
    icon: "/images/dashboard/dash-reset.png",
  },
];

export default function Page() {
  const [overViewData, setOverviewData] = useState<OverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useAdminAuth();

  const fetchCounts = async () => {
    try {
      const response = await adminApi.get("/count");
const re=await adminApi.get("/courses");

console.log("kfjalksdfjoiewm",re.data);
      if (response.data.success) {
        const { userCount, volunteerCount } = response.data;

        const dynamicData = defaultOverviewData.map((item) => ({
          ...item,
          value:
            item.key === "userCount"
              ? userCount
              : item.key === "volunteerCount"
              ? volunteerCount
              : 0, // fallback
        }));

        setOverviewData(dynamicData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  if (authLoading) return <div>Loading....</div>;

  return (
    <div>
      <h3 className="text-[#333333] font-[600] text-[22px]">Dashboard</h3>

      <div className="mt-2">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {overViewData.map((data, i) => (
            <li key={i}>
              <DashboardCard {...data} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-[20px]">
        <ul className="grid h-full items-stretch grid-cols-1 lg:grid-cols-4 gap-[20px]">
          <li className="col-span-3 h-full flex">
            <JobStatistics />
          </li>
          <li className="h-full flex">
            <JobStatus />
          </li>
        </ul>

        <ul className="grid h-full items-stretch grid-cols-1 lg:grid-cols-4 gap-[20px]">
          <li className="h-full flex">
            <CandidateSource />
          </li>
          <li className="col-span-3 h-full flex">
            <ScheduleTable />
          </li>
        </ul>
      </div>
    </div>
  );
}
