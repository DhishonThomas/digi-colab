"use client";
import React, {
    useState,
    useContext,
    Suspense,
    useEffect,
    useRef,
} from "react";
import { SideMenuMobile } from "@/components/sidebar/sideMenuMobile";
import { Header } from "@/components/header/header";
import { SideMenu } from "@/components/sidebar/sideMenu";

type Props = {
    children?: any;
};

export const SharedLayout = ({ children }: Props) => {

    return (
        <div
            className="flex w-full gap-8 pe-8"
        >
            <SideMenu
            />
            <div className="flex flex-col w-full">
                <Suspense>
                    <Header
                    />
                </Suspense>

                <div
                    className={`w-full mt-[70px]`}>
                    {children}
                </div>
            </div>
        </div>
    )
};
