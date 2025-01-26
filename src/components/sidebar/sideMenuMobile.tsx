import React, { useContext } from "react";
import Image from "next/image";
import menu from "./data.json";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideMenuMobile = () => {
  const pathName = usePathname();
  const handleSignOut = async () => {
  };

  console.log(menu)

  return (
    <div className="h-[calc(100vh-30px)] rounded-[5px] bg-sideMenuBg border-[0.5px] border-secondary pt-8 px-[10px] mt-[15px] transition duration-700 ease-in-out">
      <div className="h-[53.11px] relative flex items-center justify-center w-full mb-8">
        <Image src="/images/dashboard/logo.svg" alt="highlight" layout="fill" />
      </div>
      <div className="flex flex-col h-[calc(100%-118px)] overflow-auto scroll-hide gap-1">
        {menu.map((item: any) => (
          <Link
            href={item.path}
            key={pathName}
            className={`flex justify-center items-center h-[56px] py-[10px] px-4 ${
              pathName.includes(item.path)
                ? "bg-secondary text-text-800 rounded-[5px]"
                : "text-text-600 hover:bg-secondary hover:text-text-800 hover:rounded-[5px]"
            }`}
          >
            <div className="text-[25px] xl:text-[26px]">
              <span className={item.icon}></span>
            </div>
          </Link>
        ))}
        <button
          className="flex justify-center items-center h-[56px] py-[10px] px-4 text-text-600 hover:bg-secondary hover:text-text-800 hover:rounded-[5px]"
        >
          <div className="text-[25px] xl:text-[26px]">
            <span className="icon-logout">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};
