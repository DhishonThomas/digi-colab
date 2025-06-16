"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const token=useSelector((store:RootState)=>store.admin.token)
  useEffect(() => {
    if(!token){
        router.push("/admin/login")
        return
    }
    async function checkAdminAuth() {
      try {
        const response = await adminApi.get("/me");
        if (!response.data.success) {
          router.push("/admin/login"); 
        }
      } catch (error) {
        console.error("Admin Auth Error:", error);
        router.push("/admin/login"); 
      } finally {
        setLoading(false);
      }
    }

    checkAdminAuth();
  }, [router]);

  return { loading };
};

export default useAdminAuth;
