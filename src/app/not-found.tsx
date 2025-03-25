// pages/404.js
import { SharedLayout } from "@/components/layout/sharedLayout";
import Link from "next/link";
import { Suspense } from "react";
import login_banner from "@/../public/images/login_banner.png"
import Image from "next/image";

export default function Custom404() {
  return (
    <main className="bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
    <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
      <div className="w-full max-w-[440px]">
        <Suspense>
        <div className="bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat  shadow-lg rounded-lg p-10  text-center">
        <h1 className="text-7xl font-extrabold text-red-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Oops! Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="mt-6 px-6 py-3 text-white bg-[#688086] rounded-lg shadow-md hover:bg-[#5f767c] transition-all duration-300">
            Go Back Home
          </button>
        </Link>
      </div>        </Suspense>
      </div>
      <div className="relative hidden md:block">
        <Image alt="login banner" src={login_banner} />
      </div>
    </div>
  </main>

   
 
  );
}
