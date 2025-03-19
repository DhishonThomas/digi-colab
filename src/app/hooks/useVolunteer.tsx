"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import volunteerApi from "@/utils/axios_Interceptors/volunteerApiService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useVolunteerAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const token=useSelector((store:RootState)=>store.volunteer.token)


  useEffect(() => {
if(!token){
    router.push("/volunteer/login")
    return
}
    async function checkVolunteerAuth() {
      try {
        const response = await volunteerApi.get("/volunteer/me");
        console.log("Volunteer Data:", response.data);

        if (!response.data.status) {
      
          router.push("/volunteer/login"); 
        }
      } catch (error) {
        console.error("Volunteer Auth Error:", error);
        router.push("/volunteer/login"); 
      } finally {
        setLoading(false);
      }
    }

    checkVolunteerAuth();
  }, [router]);

  return { loading };
};

export default useVolunteerAuth;
