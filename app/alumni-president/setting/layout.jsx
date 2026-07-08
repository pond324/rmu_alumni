"use client";
import {
  Bell,
  Building2,
  List,
  ListCheck,
  Server,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTING_MENU = [
  {
    icon: <ListCheck size={18} />,
    title: "ลงทะเบียนศิษย์เก่า",
    url: "/alumni-president/setting/regis",
  },
  {
    icon: <Building2 size={18} />,
    title: "คณะ/สาขา",
    url: "/alumni-president/setting/fac-dep-setting",
  },
  {
    icon: <User size={18} />,
    title: "นำเข้าข้อมูลและบัญชี",
    url: "/alumni-president/setting/account",
  },
  {
    icon: <Bell size={18} />,
    title: "การแจ้งเตือนอีเมล",
    url: "/alumni-president/setting/notify",
  },
  {
    icon: <Server size={18} />,
    title: "สำรองข้อมูล/รีเซ็ต",
    url: "/alumni-president/setting/backup-reset",
  },
];

const SettingLayout = ({ children }) => {
  const pathName = usePathname();

  return (
    <div className="w-full p-5 bg-gray-50 flex flex-col">
      <span className="flex items-center gap-2">
        <Settings size={30} className="text-blue-500" />
        <p className="text-xl font-bold">ตั้งค่าระบบ</p>
      </span>
      <p className="text-gray-700">จัดการการตั้งค่าทั้งหมดของระบบศิษย์เก่า</p>

      <div className="mt-5 w-full p-1 rounded-lg flex-wrap bg-gray-100 shadow-xs flex items-center gap-2.5">
        {SETTING_MENU.map((s, index) => (
          <Link
            className={`${pathName === s?.url ? "text-black bg-white shadow-sm" : "text-gray-600 hover:shadow-sm hover:bg-gray-50"} p-1.5 px-2 rounded-lg flex items-center gap-2 text-sm`}
            key={index}
            href={s?.url}
          >
            {s?.icon}
            <p> {s?.title}</p>
          </Link>
        ))}
      </div>
      <div className="w-full flex flex-col">{children}</div>
    </div>
  );
};
export default SettingLayout;
