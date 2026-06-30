"use client";
import Menu from "@/layouts/menus";
import useGetSession from "@/hook/useGetSeesion";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider } from "@/context/app.context";
import Footer from "@/layouts/footer";
import AppHeader from "@/layouts/header";

const Layout = ({ children }) => {
  const { user, checking } = useGetSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (checking) return;
    if (!user?.id) {
      router.push("/");
    }
    if (user?.roleId > 4 && pathName !== "/users/overview") {
      router.push("/");
    }
  }, [checking, user]);

  return (
    <AppProvider>
      <div className="w-screen h-screen flex items-center bg-white">
        <Menu />
        <div className="flex flex-col w-full h-full overflow-auto">
          <AppHeader />
          {/* header */}
          {/* {pathName.split("/")[2] !== "news" && (
            <header className="mb-2 p-2 w-full flex items-center gap-2 pb-2 border-b border-gray-300">
              <Image alt="logo" priority className="w-10 h-10" src={logo} />
              <div className="flex flex-col lg:flex-row lg:gap-2">
                <h1 className="font-bold text-sm text-blue-600">RMU ALUMNI</h1>
                <p className="text-sm ">
                  : ระบบสารสนเทศเครือข่ายศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
                </p>
              </div>
            </header>
          )} */}

          {children}
          <Footer />
        </div>
      </div>
    </AppProvider>
  );
};
export default Layout;
