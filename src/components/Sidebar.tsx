"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBookmark,
  FiStar,
  FiSearch,
  FiSettings,
  FiHelpCircle,
  FiLogIn,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import AuthModal from "../modals/AuthModal";


import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

type SidebarLink = {
  text: string;
  icon: React.ReactNode;
  href?: string;
  notAllowed?: boolean;
  openModal?: boolean;
  action?: () => void; 
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleOpenAuthModal = () => setIsAuthModalOpen(true);
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeSidebar();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const topLinks: SidebarLink[] = [
    { text: "For You", icon: <FiHome />, href: "/for-you" },
    { text: "My Library", icon: <FiBookmark />, href: "/library" },
    { text: "Highlights", icon: <FiStar />, notAllowed: true },
    { text: "Search", icon: <FiSearch />, notAllowed: true },
  ];

  
  const bottomLinks: SidebarLink[] = [
    { text: "Settings", icon: <FiSettings />, href: "/settings" },
    { text: "Help & Support", icon: <FiHelpCircle />, notAllowed: true },
    user
      ? {
          text: "Logout",
          icon: <FiLogOut />,
          action: handleLogout,
        }
      : {
          text: "Login",
          icon: <FiLogIn />,
          openModal: true,
        },
  ];

  const renderLink = (link: SidebarLink) => {
    const isActive = link.href && pathname === link.href;

    const handleClick = (e: React.MouseEvent) => {
      if (link.notAllowed) {
        e.preventDefault();
        return;
      }

      if (link.openModal) {
        e.preventDefault();
        handleOpenAuthModal();
      }

      if (link.action) {
        e.preventDefault();
        link.action();
      }

      closeSidebar();
    };

    return (
      <a
        key={link.text}
        href={link.href || "#"}
        className={`sidebar__link--wrapper ${
          link.notAllowed ? "sidebar__link--not-allowed" : ""
        }`}
        onClick={handleClick}
      >
        <div
          className={`sidebar__link--line ${
            isActive ? "active--tab" : ""
          }`}
        ></div>

        <div
          className="sidebar__icon--wrapper"
          style={{ width: "24px", height: "24px" }}
        >
          {link.icon}
        </div>

        <div className="sidebar__link--text">{link.text}</div>
      </a>
    );
  };

  return (
    <>
      
      <div
        className={`sidebar__overlay ${
          !isOpen ? "sidebar__overlay--hidden" : ""
        }`}
        onClick={closeSidebar}
      ></div>

      <div className={`sidebar ${isOpen ? "sidebar--opened" : ""}`}>
        <div className="sidebar__logo">
          <img src="/logo.png" alt="logo" />
        </div>

        <div className="sidebar__wrapper">
          <div className="sidebar__top">
            {topLinks.map(renderLink)}
          </div>

          <div className="sidebar__bottom">
            {bottomLinks.map(renderLink)}
          </div>
        </div>
      </div>

      
      <div className="sidebar__toggle--btn" onClick={toggleSidebar}>
        <FiMenu size={24} />
      </div>

      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
      />
    </>
  );
}