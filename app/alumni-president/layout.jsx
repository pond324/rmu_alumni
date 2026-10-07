"use client";
import Menu from "@/layouts/menus";
import Image from "next/image";
import logo from "@/assets/images/logo_rmu.png";
import useGetSession from "@/hook/useGetSeesion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "../users/dashboard/dashboard-context";
import { AppProvider } from "@/context/app.context";
import Footer from "@/layouts/footer";

const Layout = ({ children }) => {
  const { user, checking } = useGetSession();
  const router = useRouter();

  useEffect(() => {
    if (checking) return;

    const timeout = setTimeout(() => {
      if (!user?.id || user?.roleId < 5) {
        router.push("/");
      }
    }, [500]);

    return () => clearTimeout(timeout);
  }, [checking, user]);

  return (
    <div className="w-full h-screen flex items-center overflow-hidden bg-gray-50">
      <Menu />
      <div className="flex flex-col flex-1 w-full h-full min-w-0 overflow-y-auto overflow-x-hidden">
        {/* header */}
        <header className="mb-2 p-3 pr-16 lg:pr-4 w-full flex items-center gap-2.5 pb-2.5 border-b shadow-2xs border-gray-200 bg-white shrink-0">
          <Image alt="logo" priority className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" src={logo} />
          <div className="flex lg:gap-2 lg:items-center lg:flex-row flex-col min-w-0">
            <h1 className="font-bold text-xs sm:text-sm text-blue-600 truncate">RMU ALUMNI</h1>
            <p className="text-xs sm:text-sm text-gray-700 truncate">
              : ระบบสารสนเทศเครือข่ายศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม (Admin)
            </p>
          </div>
        </header>
        <AppProvider>
          <DashboardContext>{children}</DashboardContext>
        </AppProvider>
        <Footer/>
      </div>
    </div>
  );
};
export default Layout;
