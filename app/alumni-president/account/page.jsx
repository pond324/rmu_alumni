"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import { isValidEmail, isValidThaiPhoneNumber, formatPhoneNumber } from "@/libs/validate";
import PasswordRules from "@/components/password-rules";
import Loading from "@/components/loading";
import { Skeleton } from "@/components/skeletons";
import {
  Check,
  Copy,
  Eye,
  EyeClosed,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Clock,
  Calendar,
  Fingerprint,
} from "lucide-react";

const PREFIX_OPTIONS = ["นาย", "นาง", "นางสาว"];

export default function AdminAccountPage() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'password'
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Form States
  const [adminData, setAdminData] = useState(null);
  const [prefix, setPrefix] = useState("นาย");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [copiedUsername, setCopiedUsername] = useState(false);

  // Password Form States
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  // Fetch admin profile
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/my-account", {
        withCredentials: true,
      });
      if (res?.data && !res?.data?.err) {
        const data = res.data;
        setAdminData(data);
        setPrefix(data.prefix || "นาย");
        setFname(data.fname || "");
        setLname(data.lname || "");
        setEmail(data.email || "");
        setTel(data.tel || "");
      }
    } catch (error) {
      console.error("fetchAdminData error:", error);
      alerts.err("ไม่สามารถโหลดข้อมูลผู้ดูแลได้ โปรดตรวจสอบการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Reset profile form
  const handleResetProfile = () => {
    if (!adminData) return;
    setPrefix(adminData.prefix || "นาย");
    setFname(adminData.fname || "");
    setLname(adminData.lname || "");
    setEmail(adminData.email || "");
    setTel(adminData.tel || "");
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!prefix.trim()) return alerts.err("กรุณาเลือกคำนำหน้าชื่อ");
    if (!fname.trim()) return alerts.err("กรุณาระบุชื่อ");
    if (!lname.trim()) return alerts.err("กรุณาระบุนามสกุล");

    if (email && !isValidEmail(email)) {
      return alerts.err("รูปแบบอีเมลไม่ถูกต้อง");
    }

    if (tel && !isValidThaiPhoneNumber(tel)) {
      return alerts.err("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)");
    }

    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันบันทึกข้อมูล",
      "คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลส่วนตัวนี้หรือไม่?",
      "บันทึก"
    );
    if (!isConfirmed) return;

    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("prefix", prefix.trim());
      formData.append("fname", fname.trim());
      formData.append("lname", lname.trim());
      formData.append("email", email.trim());
      formData.append("tel", tel.trim());

      const res = await axios.post(
        apiConfig.rmuAPI + "/president/update-my-account",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res?.data?.ok) {
        alerts.success("บันทึกข้อมูลส่วนตัวสำเร็จ");
        fetchAdminData();
      } else {
        alerts.err(res?.data?.err || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      alerts.err("ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง");
    } finally {
      setSavingProfile(false);
    }
  };

  // Auto Generate Secure Password
  const generateSecurePassword = () => {
    const lettersUpper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lettersLower = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const specials = "!@#$%^&*_-+=";

    let pwd = "";
    pwd += lettersUpper[Math.floor(Math.random() * lettersUpper.length)];
    pwd += lettersLower[Math.floor(Math.random() * lettersLower.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += specials[Math.floor(Math.random() * specials.length)];

    const all = lettersUpper + lettersLower + numbers + specials;
    for (let i = 4; i < 12; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle
    pwd = pwd
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setNewPass(pwd);
    setConfirmNewPass(pwd);
    alerts.success("สุ่มสร้างรหัสผ่านที่ปลอดภัยให้เรียบร้อยแล้ว");
  };

  // Save Password Handler
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (!currentPass) {
      return alerts.err("กรุณากรอกรหัสผ่านปัจจุบัน");
    }
    if (!newPass) {
      return alerts.err("กรุณากรอกรหัสผ่านใหม่");
    }
    if (newPass.length < 8) {
      return alerts.err("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    }
    if (!/[A-Za-z]/.test(newPass)) {
      return alerts.err("รหัสผ่านใหม่ต้องมีตัวอักษรภาษาอังกฤษ");
    }
    if (!/\d/.test(newPass)) {
      return alerts.err("รหัสผ่านใหม่ต้องมีตัวเลขอย่างน้อย 1 ตัว");
    }
    if (!/[^A-Za-z0-9]/.test(newPass)) {
      return alerts.err("รหัสผ่านใหม่ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว");
    }
    if (newPass !== confirmNewPass) {
      return alerts.err("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
    }

    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันเปลี่ยนรหัสผ่าน",
      "คุณต้องการเปลี่ยนรหัสผ่านของผู้ดูแลระบบใช่หรือไม่?",
      "เปลี่ยนรหัสผ่าน"
    );
    if (!isConfirmed) return;

    setSavingPassword(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + "/president/change-my-password",
        { currentPass, newPass },
        { withCredentials: true }
      );

      if (res?.data?.ok) {
        alerts.success("เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว");
        setCurrentPass("");
        setNewPass("");
        setConfirmNewPass("");
      } else {
        alerts.err(res?.data?.err || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }
    } catch (error) {
      console.error("Change password error:", error);
      alerts.err("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน โปรดตรวจสอบรหัสผ่านเดิม");
    } finally {
      setSavingPassword(false);
    }
  };

  const copyUsername = () => {
    if (adminData?.username) {
      navigator.clipboard.writeText(adminData.username);
      setCopiedUsername(true);
      setTimeout(() => setCopiedUsername(false), 2000);
      alerts.success("คัดลอกชื่อผู้ใช้แล้ว");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col bg-slate-50/70 p-3 sm:p-5 lg:p-8 pb-32 space-y-6 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex gap-2 p-1.5 bg-white rounded-xl shadow-2xs w-fit">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-end">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-50/70 p-3 sm:p-5 lg:p-8 pb-32 space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div>
        <p className="text-lg sm:text-xl font-bold text-gray-800">บัญชีผู้ดูแล</p>
        <p className="text-xs sm:text-sm text-gray-600">
          จัดการข้อมูลส่วนตัวและเปลี่ยนรหัสผ่านของผู้ดูแลระบบ
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-gray-200 bg-white p-1.5 rounded-xl shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <User size={16} />
          <span>ข้อมูลส่วนตัว</span>
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeTab === "password"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <KeyRound size={16} />
          <span>ความปลอดภัยและเปลี่ยนรหัสผ่าน</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left / Main Section (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {activeTab === "profile" ? (
            /* ================= Tab 1: Profile Management (No Image Display) ================= */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-blue-600 shrink-0" size={19} />
                    <span>จัดการข้อมูลส่วนตัว</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    ปรับปรุงข้อมูลชื่อ คำนำหน้า อีเมล และเบอร์โทรศัพท์สำหรับติดต่อในระบบ
                  </p>
                </div>
                <span className="w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  สิทธิ์ผู้ดูแลระบบ
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {/* Prefix: นาย, นาง, นางสาว */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      คำนำหน้าชื่อ <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                      {PREFIX_OPTIONS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPrefix(p)}
                          className={`py-2.5 text-center text-xs sm:text-sm rounded-lg border font-medium transition-all sm:px-5 ${
                            prefix === p
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                      ชื่อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      placeholder="กรอกชื่อ"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                      นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      placeholder="กรอกนามสกุล"
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Username (Read Only) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                      ชื่อผู้ใช้ในระบบ (Username สำหรับเข้าสู่ระบบ)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-mono text-sm">
                        <span className="text-gray-400 mr-1.5">@</span>
                        <span className="font-semibold">{adminData?.username}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyUsername}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
                        title="คัดลอกชื่อผู้ใช้"
                      >
                        {copiedUsername ? (
                          <>
                            <Check size={14} className="text-emerald-600" />
                            <span className="text-emerald-600">คัดลอกแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>คัดลอก</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      * ชื่อผู้ใช้งานนี้ถูกกำหนดโดยระบบ เพื่อความปลอดภัยไม่สามารถแก้ไขได้โดยตรง
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                      อีเมลติดต่อ (Email)
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@rmu.ac.th"
                        className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Telephone */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                      เบอร์โทรศัพท์ (Telephone)
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        placeholder="0812345678"
                        maxLength={10}
                        className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleResetProfile}
                    disabled={savingProfile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-xs transition"
                  >
                    <RotateCcw size={15} />
                    <span>คืนค่าเดิม</span>
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition active:scale-98 disabled:opacity-70"
                  >
                    {savingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>กำลังบันทึก...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>บันทึกข้อมูลส่วนตัว</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= Tab 2: Change Password ================= */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Lock className="text-blue-600 shrink-0" size={19} />
                    <span>เปลี่ยนรหัสผ่านผู้ดูแลระบบ</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    ตั้งรหัสผ่านใหม่เพื่อเพิ่มความปลอดภัยในการเข้าถึงระบบจัดการ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateSecurePassword}
                  className="w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition shadow-xs"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>สุ่มสร้างรหัสผ่าน</span>
                </button>
              </div>

              <form onSubmit={handleSavePassword} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    รหัสผ่านปัจจุบัน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="กรอกรหัสผ่านปัจจุบันของคุณ"
                      className="w-full text-sm px-3.5 pr-11 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <Eye size={18} /> : <EyeClosed size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    รหัสผ่านใหม่ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="สร้างรหัสผ่านใหม่"
                      className="w-full text-sm px-3.5 pr-11 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <Eye size={18} /> : <EyeClosed size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    ยืนยันรหัสผ่านใหม่ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPass ? "text" : "password"}
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      placeholder="กรอกรหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                      className="w-full text-sm px-3.5 pr-11 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmNewPass ? <Eye size={18} /> : <EyeClosed size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Match Status */}
                {newPass && confirmNewPass && (
                  <div
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                      newPass === confirmNewPass
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {newPass === confirmNewPass ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>รหัสผ่านใหม่ตรงกันแล้ว</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={14} className="text-rose-600" />
                        <span>รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน</span>
                      </>
                    )}
                  </div>
                )}

                {/* Password Rules Card */}
                {newPass && (
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      เกณฑ์ความปลอดภัยของรหัสผ่าน:
                    </label>
                    <PasswordRules password={newPass} />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition active:scale-98 disabled:opacity-70"
                  >
                    {savingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>กำลังเปลี่ยนรหัสผ่าน...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} />
                        <span>เปลี่ยนรหัสผ่าน</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Section: System & Security Info Cards (1 col) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Card: Account Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={18} />
              ข้อมูลสถานะบัญชี
            </h3>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">สถานะการใช้งาน:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  เปิดใช้งานปกติ
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">ระดับสิทธิ์:</span>
                <span className="font-medium text-blue-700">ผู้ดูแลระบบ (Admin)</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-gray-100 gap-2">
                <span className="text-gray-500 shrink-0">รหัสผู้ดูแล (UUID):</span>
                <span className="font-mono text-[11px] text-gray-700 break-all text-right">
                  {adminData?.admin_id}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">วันที่สร้างบัญชี:</span>
                <span className="text-gray-800">
                  {adminData?.createdAt ? DateTHFormat(adminData.createdAt) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">อัปเดตข้อมูลล่าสุด:</span>
                <span className="text-gray-800">
                  {adminData?.updatedAt ? DateTHFormat(adminData.updatedAt) : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Security Advice */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80 p-5 space-y-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Shield size={18} className="text-blue-600" />
              คำแนะนำความปลอดภัย
            </div>
            <ul className="space-y-2 text-gray-600 text-xs leading-relaxed list-disc list-inside">
              <li>ไม่ควรเปิดเผยรหัสผ่านหรือส่งต่อชื่อผู้ใช้งานให้ผู้อื่น</li>
              <li>เปลี่ยนรหัสผ่านเป็นประจำทุก 3 - 6 เดือน เพื่อความปลอดภัย</li>
              <li>ใช้รหัสผ่านที่มีทั้งตัวอักษรพิมพ์ใหญ่-เล็ก ตัวเลข และสัญลักษณ์</li>
              <li>เมื่อใช้งานบนเครื่องคอมพิวเตอร์สาธารณะ ให้กดออกจากระบบทุกครั้ง</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
