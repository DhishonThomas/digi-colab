"use client";

import useVolunteerAuth from "@/app/hooks/useVolunteer";
import SpinLoading from "@/components/loading/spinLoading";
import volunteerApi from "@/utils/axios_Interceptors/volunteerApiService";
import { useEffect, useState } from "react";
import CandidatesTable from "./components/CandidatesTable";
import NoData from "@/components/ui/NoData";

export default function Page() {
  const { loading: authLoading } = useVolunteerAuth();
  const [candidates, setCandidates] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch candidates from the API
  async function fetchUsers() {
    try {
      const { data } = await volunteerApi.get("/users-details");

      if (data.success) {
        setCandidates(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (authLoading || isLoading) {
    return <SpinLoading />;
  }

  return (
    <div>
      {candidates.length === 0 ? (
        <NoData
          message="No Candidates Found"
          description="It seems there are no candidates registered under this volunteer at the moment. Please check back later or encourage candidates to register."
          actionText="Add a Candidate"
        />
      ) : (
        <CandidatesTable candidates={candidates} />
      )}
    </div>
  );
}
