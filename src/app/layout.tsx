"use client";

import "./globals.css";


import { useState } from "react";
import Sidebar from "../components/Sidebar";
import AuthModal from "../modals/AuthModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        
        {showSidebar && <Sidebar />}


        
        <div className="wrapper">
          <div className="row">
            <div className="container">{children}</div>
          </div>
        </div>

        
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </body>
    </html>
  );
}