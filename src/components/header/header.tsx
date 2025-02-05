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

type Props = {
};

export const Header: React.FC<Props> = ({
}) => {
  const [langBtnHide, setLangBtnHide] = useState(false);
  const toggleLangBtn = () => {
    setLangBtnHide(!langBtnHide);
  };
  const searchParams = useSearchParams();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef: MutableRefObject<HTMLDivElement | null> = useRef(null); // Reference to the pop-up
  const pathname = usePathname();
  const router = useRouter();
  const newPath =
    pathname.includes("/ar") || pathname.includes("/en")
      ? pathname.slice(3)
      : pathname;
  // console.log("pathname",updatedProfileData)

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
      className={`flex justify-between w-full h-[70px] py-[15px] bg-primary pr-[15px] items-center z-10 mt-[26px]`}
    >
      <h3 className="text-[26px] font-[500] leading-[39px]">
        <span className="text-[#B56365]">Welcome,</span> User
      </h3>
      <div className="shadow-[0_0px_100px_rgba(0,0,0,0.1)] bg-[#fff]  rounded-[50px] p-[10px] flex items-center justify-between gap-[21px]">
        <div className="flex items-center w-full gap-[10px] p-[10px] bg-[#E9E9E9] rounded-[50px] xl:w-[304px]">
          <button type="button" className="h-5">
            <Image alt="icon" src={'/icons/icon-search.svg'} width={20} height={20} />
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
            <Image alt="icon" src={'/icons/icon-bell.svg'} width={24} height={24} />
          </div>
          <div className="cursor-pointer hover:opacity-100 opacity-40">
            <Image alt="icon" src={'/icons/icon-info.svg'} width={24} height={24} />
          </div>
          <div className="w-[40px] h-[40px] cursor-pointer overflow-hidden aspect-square rounded-full">
            <Image alt="icon" src={'/images/dummy_profile.png'} className="aspect-square object-cover" width={40} height={40} />
          </div>
        </div>

      </div>

    </div>
  );
};
