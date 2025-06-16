"use client"
import useUserAuth from "@/app/hooks/useUserAuth"
import {  useEffect, useState } from "react"
import CCCSection from "./components/CCCCertification"
import userApi from "@/utils/axios_Interceptors/userApiService"
import SuccessFullSubmission from "./components/SuccessFullSubmission"

export default function page() {

    const {loading}=useUserAuth()
    const [isSubmitted, setIsSubmitted] = useState(false);
    const checkIsSubmitted=async()=>{
      const response=await userApi.get("/course-selection");
    
      if(response.data.success&&response.data.hasSelectedCourse){
        setIsSubmitted(true)
      }else{
        setIsSubmitted(false)
      }
    }
    useEffect(()=>{
      checkIsSubmitted()
    },[])
    if(loading){
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-white text-black">
              Checking authentication...
            </div>
          );    }
   
   
const handleUpdate= async () => {
  setIsSubmitted(false);
  }
          return (
        <div> {isSubmitted?(  <SuccessFullSubmission handleUpdate={handleUpdate} />
        ):(
         
          <CCCSection />
        )
        }</div>
    )
}