// components/DropdownMenu.tsx
"use client";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FadeInSection from "./fade-in-section";
import ManageBtn from "@/app/alumni-president/manage-alumni-regis/manage-btn";

export default function DropdownMenu({
  menus = [],
  icon = <ChevronDown />,
  buttonTitle = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (
      event.target.closest(".swal2-container") ||
      event.target.closest(".swal2-popup") ||
      event.target.closest(".app-modal-portal") ||
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
    <div className="relative inline-block bg-white" ref={menuRef}>
      <button
        title={buttonTitle}
        onClick={toggleMenu}
        className="p-1.5 rounded-full hover:bg-blue-400 hover:text-white"
      >
        {icon}
      </button>

      {isOpen && (
        <FadeInSection
          className={`absolute p-2 md:left-[-6.5rem] bg-white left-[-9rem] z-20 w-36 ${
            menus.length < 7 ? "h-auto" : "h-80"
          } overflow-y-auto bg-white shadow-lg border border-gray-300 rounded-lg`}
        >
          <p className="text-sm mb-2 font-bold w-full pb-2 border-b border-blue-300">
            จัดการ
          </p>

          {menus.map((m, index) => (
            <button
              key={index}
              onClick={m.func}
              className="w-full text-sm pl-2.5 py-1.5 rounded-lg hover:bg-linear-90 hover:from-blue-600 hover:to-sky-300 hover:text-white text-[0.85rem] text-start flex items-center gap-2"
            >
              {m?.icon}
              <p> {m?.title}</p>
            </button>
          ))}
          
        </FadeInSection>
      )}
    </div>
  );
}
