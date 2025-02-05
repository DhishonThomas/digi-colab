import React from 'react'

import { SharedLayout } from '@/components/layout/sharedLayout';

export default async function DashboardLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params:any;
}>) {

  return (
    <div className=' bg-[url(/images/background.png)] bg-cover bg-center bg-no-repeat]'>
        <SharedLayout>
        {children}
        </SharedLayout>
    </div>
  )
}
