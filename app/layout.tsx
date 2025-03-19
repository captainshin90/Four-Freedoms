"use client";

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { useState, useEffect } from 'react';
import React from 'react';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

const metadata = {
   title: 'Four Freedoms',
   description: 'Engage with town podcasts and talk back',
//   icons: {
//    icon: '/favicon.ico',
//   },
};

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    // Time-based updates here
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}