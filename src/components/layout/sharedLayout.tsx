"use client";
import React, { Suspense } from "react";
import { SideMenuMobile } from "@/components/sidebar/sideMenuMobile";
import { Header } from "@/components/header/header";
import { SideMenu } from "@/components/sidebar/sideMenu";

type Props = {
  children?: React.ReactNode;
};

export const SharedLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
        <SideMenu />

      <div className="flex flex-col flex-1 max-h-screen overflow-hidden">
        <div className="sticky top-0 z-50">
          <Suspense>
            <Header />
          </Suspense>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
