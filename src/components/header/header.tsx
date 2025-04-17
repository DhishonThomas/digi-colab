import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  useContext,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { data } from "@/app/(dashboard)/admin/dashboard/components/statisticsChart";

type Props = {};

export const Header: React.FC<Props> = ({}) => {
  const pathName = usePathname();
  const [userData, setUserData] = useState<any>(null);

  const adminData = useSelector((store: RootState) => store.admin);
  const volunteerData = useSelector((store: RootState) => store.volunteer);
  const user = useSelector((store: RootState) => store.user);

  useEffect(() => {
    if (pathName.startsWith("/admin")) {
      setUserData(adminData);
    } else if (pathName.startsWith("/volunteer")) {
      setUserData(volunteerData);
    } else {
      setUserData(user);
      console.log("this is data from the store >", user);
    }
  }, [pathName, adminData, volunteerData, user]);

  const [langBtnHide, setLangBtnHide] = useState(false);
  const toggleLangBtn = () => {
    setLangBtnHide(!langBtnHide);
  };
  const searchParams = useSearchParams();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef: MutableRefObject<HTMLDivElement | null> = useRef(null); // Reference to the pop-up
  const newPath =
    pathName.includes("/ar") || pathName.includes("/en")
      ? pathName.slice(3)
      : pathName;
  // console.log("pathName",updatedProfileData)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    };

    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);
  // console.log("profiledata",updatedProfileData)

  return (
    <div
      className={`sticky rounded-xl top-0 z-50 shadow flex justify-between w-full h-[50px] py-[35px] bg-primary pr-[10px] items-center mt-[20px]`}
    >
      <h3 className="text-[26px] font-[500] leading-[39px]">
        <span className="text-[#B56365]">
          Welcome,{" "}
          {userData
            ? userData?.user?.name ||
              userData?.admin?.name ||
              userData?.volunteer?.name
            : ""}
        </span>
      </h3>
      <div className="shadow-[0_0px_100px_rgba(0,0,0,0.1)] bg-[#fff]  rounded-[50px] p-[10px] flex items-center justify-between gap-[21px]">
        <div className="flex items-center w-full gap-[10px] p-[10px] bg-[#E9E9E9] rounded-[50px] xl:w-[304px]">
          <button type="button" className="h-5">
            <Image
              alt="icon"
              src={"/icons/icon-search.svg"}
              width={20}
              height={20}
            />
          </button>
          <input
            name="search"
            type="text"
            placeholder={"Search"}
            className="text-[14px] bg-[#E9E9E9] placeholder:text-[#6D838A66] outline-none w-full"
          />
        </div>
        <div className="flex justify-between items-center gap-[37px]">
          <div className="cursor-pointer hover:opacity-100 opacity-40">
            <Image
              alt="icon"
              src={"/icons/icon-bell.svg"}
              width={24}
              height={24}
            />
          </div>
          <div className="cursor-pointer hover:opacity-100 opacity-40">
            <Image
              alt="icon"
              src={"/icons/icon-info.svg"}
              width={24}
              height={24}
            />
          </div>
          <div className="w-[40px] h-[40px] cursor-pointer overflow-hidden aspect-square rounded-full">
            <Image
              alt="icon"
              src={(userData?.user?.image||userData?.admin?.image||userData?.volunteer?.image)?? "/images/dummy_profile.png"}
              className="aspect-square object-cover"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
