import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto shrink-0 pt-6 pb-6 border-t border-slate-200 bg-white text-slate-500 flex flex-col items-center gap-1 text-xs">
      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      <span className="flex items-center gap-1">
        <p>พัฒนาโดย</p>{" "}
        <p className="text-blue-600 font-medium">มหาวิทยาลัยราชภัฏมหาสารคาม</p>
      </span>
      <p className="text-center text-slate-400">
        เลขที่ 80 ถนนนครสวรรค์ ตำบลตลาด อำเภอเมือง จังหวัดมหาสารคาม 44000 โทรศัพท์ 0-43722118-9
      </p>
      <p className="text-slate-400">นายปฐมพร วงสุวรรณ ผู้พัฒนา</p>
    </footer>
  );
};
export default Footer;
