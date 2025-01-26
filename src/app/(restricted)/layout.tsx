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
    <div className='bg-primary'>
        <SharedLayout>
        {children}
        </SharedLayout>
    </div>
  )
}
