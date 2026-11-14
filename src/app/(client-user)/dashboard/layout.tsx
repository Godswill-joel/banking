"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProtectedRoute from '../components/ProtectedRoute'
import { SidebarProvider, useSidebar } from "../contex/SidebarContex";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        <ProtectedRoute>
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
        </ProtectedRoute>
      </body>
    </html>
  );
}



function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main
          className={`flex-1 mt-16 sm:p-2 bg-black transition-all max-sm:w-screen overflow-hidden duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}  
        >
          {children}
        </main>
      </div>
    </>
  );
}
