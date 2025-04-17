"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";

import { usePathname } from "next/navigation";

import userMenu from "./userMenu.json";
import volunteerMenu from "./volunteerMenu.json";
import adminMenu from "./adminMenu.json";
import Link from "next/link";
import Skelton from "./skelton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation"; // ✅ Correct
import { logout as adminLogout } from "@/store/slices/adminSlice";
import { logout as volunteerLogout } from "@/store/slices/volunteer";
import { logout as userLogout } from "@/store/slices/userSlice";

type Props = {
};

export const SideMenu = ({
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [menuList, setMenulist] = useState([]);
  const pathname = usePathname();
  const menuList = pathname.startsWith("/admin")?adminMenu:pathname.startsWith("/volunteer")?volunteerMenu:userMenu
  //const {setUserProfile} = useUserProfile()||{}

  // console.log(activeLink)
  const admin=useSelector((state:RootState)=>state.admin)
  const user=useSelector((state:RootState)=>state.user)
  const volunteer=useSelector((state:RootState)=>state.volunteer)
  const dispatch=useDispatch()
  const router=useRouter()
const handleLogout=()=>{

  if(pathname.startsWith("/admin")&&admin.token){
    dispatch(adminLogout())
    router.push("/admin/login")
  }else if(pathname.startsWith("/volunteer")&&volunteer.token){
    dispatch(volunteerLogout())
    router.push("/volunteer/login")
  }else if(pathname.startsWith("/")&&user.token){
    dispatch(userLogout())
    router.push("/login")
  }
}

  return (
    <div
      className={`min-h-[100vh] flex flex-col  bg-[#E4E4E4] px-[10px] transition-all duration-500 sidebar-scroll`}
    >

      <div className=" relative flex items-center justify-center w-full mt-[24px] mb-[20px]">
        <Image
          src="/images/logo.svg"
          alt="digicolab"
          width={105}
          height={95}
        />
      </div>
      {isLoading ? (
        <Skelton />
      ) : (
        <div className="flex flex-col h-[calc(100%-118px)] gap-6 scroll-hide">
          {menuList &&
            menuList.length > 0 &&
            menuList.map((item: any, index: number) => (
              <Link
                // href={`${item.path.startsWith('/') ? item.path: `/${item.path}`}`}
                href={item.path}
                key={item.title}
                className={`flex text-[#C16D70] opacity-50 justify-start items-center text-[16px] w-[208px] h-[30px] px-4 gap-[10px] ${
                  item.path == pathname || pathname.includes(item.path)
                    ? "font-[700] rounded-[5px] opacity-100"
                    : " hover:font-[700] hover:opacity-100"
                }`}
              >
                <div className="text-[25px] xl:text-[26px]">
                  <Image alt="icon" src={item.icon} width={20} height={20}/>
                </div>
                <span >
                  {item.title}
                </span>
              </Link>
            ))}
        </div>
      )}
          
          <button
              onClick={handleLogout}
                className={`mb-[30px] flex text-[#C16D70] hover:font-[700] justify-start items-center text-[16px] w-[208px] h-[30px] px-4 gap-[10px]  "font-[700] rounded-[5px] opacity-100`}
              >
                <div className="text-[25px] xl:text-[26px]">
                  <Image alt="icon" src={'/icons/sidebar/icon-signout.svg'} width={20} height={20}/>
                </div>
                <span >
                  Sign Out
                </span>
              </button>
    </div>
  );
};
