"use client";

import "./globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import AuthModal from "../modals/AuthModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();

 
  const noSidebarPages = ["/choose-plan", "/checkout"];
  const showSidebar = !noSidebarPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        
        {showSidebar && <Sidebar onLoginClick={() => setIsAuthOpen(true)} />}

        
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        
        {children}
      </body>
    </html>
  );
}