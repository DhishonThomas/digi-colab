import React from "react";
import Image, { StaticImageData } from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  showSideImage?: boolean;
  sideImageSrc?: string | StaticImageData;
  maxWidth?: string;
  hideScroll?:boolean
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  backgroundImage = "/images/watermark_logo.png",
  showSideImage = false,
  sideImageSrc,
  maxWidth = "510px",
  hideScroll=false,
}) => {
  return (
    <main
      className={`bg-center bg-no-repeat ${hideScroll?"overflow-y-hidden":"overflow-y-auto"}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="flex w-full  justify-center gap-[173px] container py-[100px]">
        <div className="w-full" style={{ maxWidth }}>{children}</div>

        {showSideImage && sideImageSrc && (
          <div className="relative hidden md:block">
            <Image alt="auth side visual" src={sideImageSrc} />
          </div>
        )}
      </div>
    </main>
  );
};

export default AuthLayout;
