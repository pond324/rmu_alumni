// components/DropdownMenu.tsx
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";

import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export default function ToggleAccoutStatus({
  canUse = true,
  user_id = "",
  role,
  fetchData = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [load, setLoading] = useState(false);
  const handleAllowedAccount = async () => {
    if (canUse) {
      return alerts.success("อนุมัติบัญชีแล้ว");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "อนุมัติการใช้งานบัญชี้นี้",
      "บัญชีนี้จะสามารถเข้าใช้งานระบบได้ปกติ",
      "อนุมัติ",
    );
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/manage-account/${user_id}`,
        { canUse: !canUse, role },
        { withCredentials: true },
      );
      if (res.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res.status === 200) {
        fetchData();
        alerts.success("อนุมัติบัญชี้นี้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const handleBlockAccount = async () => {
    if (!canUse) {
      return alerts.warning("ระงับบัญชีแล้ว");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ระงับการใช้งานบัญชี้นี้",
      "บัญชีนี้จะไม่สามารถเข้าใช้งานระบบได้จนกว่าคุณจะอนุมัติ",
      "ระงับ",
    );
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/manage-account/${user_id}`,
        { canUse: !canUse, role },
        { withCredentials: true },
      );
      if (res.status === 200) {
        fetchData();
        alerts.success("ระงับบัญชีนี้แล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  if (!user_id) return <Loader2 className="animate-spin" />;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        title={"เลือกสถานะ"}
        disabled={load}
        onClick={toggleMenu}
        className={`p-1 text-xs border border-gray-100 px-2.5 flex items-center gap-2 ${
          canUse ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        } rounded-full `}
      >
        {load ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            {" "}
            <p>{canUse ? "ใช้งานได้" : "ระงับอยู่"}</p>
            <FaCaretDown />
          </>
        )}
      </button>

      {isOpen && (
        <FadeInSection
          className={`absolute  z-10 mt-2 w-30 h-auto overflow-hidden overflow-y-auto p-1.5 bg-white shadow-lg border border-gray-200 rounded-lg`}
        >
          <p className="pt-0 p-1.5 text-sm font-bold border-b border-gray-200 w-full">
            จัดการบัญชี
          </p>
          {!canUse && (
            <button
              onClick={handleAllowedAccount}
              className="w-full mt-1 hover:bg-green-500 hover:text-white rounded-lg px-2 p-1.5 flex items-center gap-2 text-sm"
            >
              <CheckCircle size={18} color="green" />
              <p>เปิดใช้งาน</p>
            </button>
          )}
          {canUse && (
            <button
              onClick={handleBlockAccount}
              className="w-full mt-1 hover:bg-red-500 hover:text-white rounded-lg px-2 p-1.5 text-red-500 flex items-center gap-2 text-sm"
            >
              <FaX />
              <p>ระงับ</p>
            </button>
          )}
        </FadeInSection>
      )}
    </div>
  );
}
