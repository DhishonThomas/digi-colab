"use client"

import useUserAuth from "@/app/hooks/useUserAuth"
import userApi from "@/utils/axios_Interceptors/userApiService"
import { useEffect, useState } from "react"

export default function page() {

    const {loading}=useUserAuth()

    if(loading){
        return( <div>Loading....</div> )
    }
    return (
        <div>
            <h3 className="text-[#333333] font-[600] text-[22px] ">Dashboard</h3>
         
         <p>User Interface</p>

        </div>
    )
}