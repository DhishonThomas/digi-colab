"use client"
import React, { Suspense, useState } from 'react';
import BasicForm from './components/basicForm';
import VerificationForm from './components/verificationForm';
import AccountForm from './components/accountForm';

const options = [
    { value: 'english', label: 'EN' },
    { value: 'arabic', label: 'AR' },
];

type Tab = 'basic'|'verification'|'account'

type TabType= {
    label: string;
    value: Tab;
}[]
const tabs:TabType = [
    { label:"BASIC DETAILS",value: 'basic'},
    { label:"VERIFICATION",value: 'verification'},
    { label:"ACCOUNT CREATION",value: 'account'},
]

function page() {
    const [activeTab, setActiveTab] = useState<{index:number,value:Tab}>({index:0,value:"basic"})

    return (
        <main className=" bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat">
            <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
                <div className="w-full max-w-[310px]">
                    <div className="flex flex-col items-center gap-2 mb-[67px]">
                        <h1 className="text-text-primary text-[36px] leading-[40px] md:leading-[56px] font-semibold">
                            Register
                        </h1>
                    </div>
                    <div className="flex items-center justify-center mb-[44px] gap-[65px]">
                        {tabs.map((tab,i)=>
                        <div key={i} onClick={()=>setActiveTab({index:i,value:tab.value})} className='flex flex-col items-center'>
                            <div className={`text-[10px] font-[600] border border-[#DADADA] w-[32px] flex items-center justify-center rounded-full aspect-square ${activeTab.index>=i?"bg-[#688086] text-[#ffffff]":""}`}>{i+1}</div>
                            <div className='text-[8px] whitespace-nowrap text-nowrap'>{tab.label}</div>

                        </div>)}
                    </div>
                    <Suspense>
                        <TabDispatcher switchTab={setActiveTab} activeTab={activeTab.value} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}

export default page;

const TabDispatcher = ({ activeTab,switchTab }: { activeTab: string,switchTab:any }) => {
    switch (activeTab) {
        case "basic": return <BasicForm switchTab={switchTab} />
        case "verification": return <VerificationForm switchTab={switchTab}  />
        case "account": return <AccountForm switchTab={switchTab}  />
        default: return <></>
    }
}