// components/DropdownMenu.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import FadeInSection from "./fade-in-section";
import { FaEllipsisV } from "react-icons/fa";

export default function DropdownMenu({
  menus = [],
  icon = <FaEllipsisV size={15} />,
  buttonTitle = "",
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (
      event.target.closest(".swal2-container") || // SweetAlert2
      event.target.closest(".swal2-popup") ||
      event.target.closest(".app-modal-portal") || // Modal Portal
      event.target.closest("[data-modal]")
    ) {
      return;
    }
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        title={buttonTitle}
        onClick={toggleMenu}
        className="p-1.5 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {icon}
      </button>

      {isOpen && (
        <FadeInSection
          className={`absolute p-2 md:left-[-6.5rem] bg-white left-[-9rem] z-20 w-40 ${
            menus.length < 7 ? "h-auto" : "h-80"
          } overflow-y-auto bg-white shadow-lg border border-gray-300 rounded-lg`}
        >
          <p className="text-sm mb-2 font-bold w-full pb-2 border-b border-blue-300">
            จัดการ
          </p>

          <div className="w-full flex flex-col gap-0.5">{children}</div>
        </FadeInSection>
      )}
    </div>
  );
}
