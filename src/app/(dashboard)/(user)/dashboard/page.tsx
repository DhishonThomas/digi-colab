"use client"

import useUserAuth from "@/app/hooks/useUserAuth"
import {  useState } from "react"
import CCCSection from "./components/CCCCertification"

export default function page() {

    const {loading}=useUserAuth()
    const [isCCCUploaded, setIsCCCUploaded] = useState(false);

    if(loading){
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-white text-black">
              Checking authentication...
            </div>
          );    }
    return (
        <div>         
      <CCCSection />
        </div>
    )
}