"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userApi from "@/utils/axios_Interceptors/userApiService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useUserAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const token=useSelector((state:RootState)=>state.user.token)
console.log(token)

  useEffect(() => {
    if(!token){
      router.push("/login");
    return
    }
    async function checkUserAuth() {
      try {
        const response = await userApi.get("/me");
        console.log("User Data:", response.data);

        if (!response.data.success) {
        
          router.push("/login");
        }
      } catch (error) {
        console.error("User Auth Error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkUserAuth();
  }, [router]);

  return { loading };
};

export default useUserAuth;
