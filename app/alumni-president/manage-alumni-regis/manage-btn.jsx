import { departmentText, facultyText } from "@/components/faculty-p";
import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { TimeTHFormat } from "@/libs/thai-local-formate-date";
import axios from "axios";
import {
  CheckCircle,
  Download,
  Edit,
  Eye,
  FileText,
  Loader2,
  Pen,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import RefuseBtn from "./refuse-btn";
import { formatPhoneNumber } from "@/libs/validate";
import DeleteRegisBtn from "./delete-regis";

const ManageBtn = ({ alumni, faculties, departments, fetch }) => {
  const [showModal, setShowModal] = useState(false);

  const [regisData, setRegisData] = useState(null);
  const [load, setLoad] = useState(true);
  const getRegisData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI +
          `/president/get-alumni-regis-data/${alumni?.alumni_id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setRegisData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    if (!showModal) return;
    getRegisData();
  }, [showModal]);

  const handleDownload = async (url) => {
    const response = await fetch(url);

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = alumni?.alumni_id + "_slip.jpg";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const [processing, setProcessing] = useState(false);
  const handleAccept = async () => {
    let isConfirm = false;
    if (!regisData?.id) {
      const { isConfirmed } = await alerts.confirmDialog(
        "ไม่พบข้อมูลการชำระของนักศึกษา!!",
        `ต้องการอนุมัติคำขอของ ${alumni?.prefix || ""}
                ${alumni?.fname || ""} ${alumni?.lname || ""} 
                (รหัส ${alumni?.alumni_id}) ใช่หรือไม่? หลังจากอนุมัตินักศึกษาจะสามารถเข้าสู่ระบบได้ทันที`,
      );
      if (!isConfirmed) return;
      isConfirm = isConfirmed;
    } else {
      const { isConfirmed } = await alerts.confirmDialog(
        "ยืนยันการอนุมัติ",
        `ต้องการอนุมัติคำขอของ ${alumni?.prefix || ""}
                ${alumni?.fname || ""} ${alumni?.lname || ""} 
                (รหัส ${alumni?.alumni_id}) ใช่หรือไม่? หลังจากอนุมัตินักศึกษาจะสามารถเข้าสู่ระบบได้ทันที`,
      );
      isConfirm = isConfirmed;
    }
    if (!isConfirm) return;
    setProcessing(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/accept-regis-alumni/${regisData?.id}`,
        { alumni_id: alumni?.alumni_id },
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success(
          "อนุมัติการลงทะเบียนแล้ว! ระบบได้ส่งข้อความแจ้งเตือนไปยังอีเมลของศิษย์เก่าแล้ว!",
        );
        fetch();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setProcessing(false);
    }
  };

  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 px-3.5 mt-2.5 lg:mt-0 justify-center shadow-sm rounded-lg flex items-center gap-2 bg-gray-50 hover:bg-blue-500 hover:text-white"
      >
        <Eye size={16} />
        <p>จัดการ</p>
      </button>
      <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
        <div className="w-full lg:w-1/3 z-50 overflow-auto rounded-lg flex flex-col bg-white">
          <div className="w-full flex  border-b border-gray-300  items-start justify-between p-5">
            <span className="flex flex-col">
              <p className="font-semibold text-lg text-blue-500">
                รายละเอียดการชำระค่าลงทะเบียน
              </p>{" "}
              <p className="text-gray-700">
                {alumni?.prefix || ""}
                {alumni?.fname || ""} {alumni?.lname || ""} •{" "}
                {alumni?.alumni_id}
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="w-full flex flex-col h-[450px] overflow-auto p-5 pt-0">
            {" "}
            <div className="mt-2 pt-5 w-full grid grid-cols-2 gap-3">
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600">ชื่อ-นามสกุล</p>
                <p className="">
                  {" "}
                  {alumni?.prefix || ""}
                  {alumni?.fname || ""} {alumni?.lname || ""}
                </p>
              </span>
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600">รหัสนักศึกษา</p>
                <p className="">{alumni?.alumni_id}</p>
              </span>
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600">คณะ</p>
                <p className=""> {facultyText(faculties, alumni?.facultyId)}</p>
              </span>
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600">สาขา</p>
                <p className="">
                  {departmentText(departments, alumni?.departmentId)}
                </p>
              </span>
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600">ปีที่การศึกษา</p>
                <p className="">
                  {" "}
                  {alumni?.year_start || "ไม่พบข้อมูล"} -{" "}
                  {alumni?.year_end || "ไม่พบข้อมูล"}
                </p>
              </span>
              <span className="flex flex-col text-sm">
                <p className="text-xs text-gray-600 mb-1.5">
                  สถานะการลงทะเบียน
                </p>

                {regisData?.isApproved === "pending" ? (
                  <div className="flex flex-col gap-1">
                    <span className="w-fit bg-orange-100 text-orange-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                      รอตรวจสอบ
                    </span>
                  </div>
                ) : regisData?.isApproved === "accept" ? (
                  <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    ลงทะเบียนแล้ว
                  </span>
                ) : regisData?.isApproved === "refuse" ? (
                  <div className="flex flex-col gap-1">
                    <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                      ปฏิเสธ
                    </span>
                  </div>
                ) : (
                  <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    ยังไม่ลงทะเบียน
                  </span>
                )}
              </span>

              {!load && regisData?.id && (
                <>
                  {" "}
                  <span className="flex flex-col text-sm mt-1.5">
                    <p className="text-xs text-gray-600">วันที่ชำระครั้งแรก</p>
                    <p className="">
                      {/* {DateTHFormat(regisData?.createdAt)}{" "} */}
                      {TimeTHFormat(regisData?.createdAt)}
                    </p>
                  </span>
                  <span className="flex flex-col text-sm mt-1.5">
                    <p className="text-xs text-gray-600">แก้ไขสลิปล่าสุด</p>
                    <p className="">
                      {" "}
                      {/* {DateTHFormat(regisData?.updatedAt)}{" "} */}
                      {TimeTHFormat(regisData?.updatedAt)}
                    </p>
                  </span>
                  <span className="flex flex-col text-sm mt-1.5">
                    <p className="text-xs text-gray-600">ช่องทางการติดต่อ</p>
                    <p className="">
                      {" "}
                      {/* {DateTHFormat(regisData?.updatedAt)}{" "} */}
                      {formatPhoneNumber(regisData?.tel)}
                    </p>
                  </span>
                </>
              )}
            </div>
            {load ? (
              <div className="w-full py-28 flex flex-col mt-1.5 gap-2 items-center justify-center">
                <Loader2 size={25} className="animate-spin text-blue-600" />
                <p>กำลังโหลด...</p>
              </div>
            ) : regisData?.id && regisData?.slip_payment_url ? (
              <div className="mt-5 w-full flex flex-col">
                <span className="w-full flex items-center justify-between text-sm text-gray-600">
                  <p>หลักฐานการชำระ</p>
                  <button
                    onClick={() =>
                      handleDownload(
                        apiConfig.imgAPI + regisData?.slip_payment_url,
                      )
                    }
                    className="flex hover:text-white hover:bg-blue-500 items-center gap-2 p-1.5 px-2.5 rounded-lg"
                  >
                    <Download size={18} />
                    <p>ดาวน์โหลด</p>
                  </button>
                </span>

                <div className="w-full mt-3 shadow-sm">
                  <img
                    src={apiConfig.imgAPI + regisData?.slip_payment_url}
                    className="w-full h-auto rounded-lg shadow-sm"
                    alt=""
                  />
                </div>
              </div>
            ) : (
              <div className="w-full py-28 flex flex-col  mt-1.5 gap-2 items-center justify-center">
                <FileText size={45} className="text-gray-600" />
                <p>ไม่พบข้อมูลการชำระค่าลงทะเบียนของนักศึกษารายนี้</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 w-full p-5 flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="p-2.5 px-3.5 rounded-lg border border-gray-300 shadow-xs"
            >
              ปิด
            </button>
            {!load && (
              <>
                {regisData?.isApproved !== "pending" && !isEdit ? (
                  <button
                    disabled={processing}
                    onClick={() => setIsEdit(true)}
                    className="p-2.5 px-3.5 rounded-lg flex items-center gap-3.5 text-sm bg-gray-200"
                  >
                    {" "}
                    <Pen size={16} />
                    <p>แก้ไขสถานะ</p>
                  </button>
                ) : (
                  (isEdit || regisData?.isApproved === "pending") && (
                    <>
                      {" "}
                      {regisData?.isApproved !== "pending" && (
                        <button
                          disabled={processing}
                          onClick={() => setIsEdit(false)}
                          className="p-2.5 px-3.5 rounded-lg flex items-center gap-3.5 text-sm bg-gray-200"
                        >
                          {" "}
                          <X size={16} />
                          <p>ยกเลิก</p>
                        </button>
                      )}
                      {regisData?.id && regisData?.isApproved !== "pending" && (
                        <DeleteRegisBtn
                          fetch={fetch}
                          processing={processing}
                          regisData={regisData}
                          alumni={alumni}
                        />
                      )}
                      {regisData?.isApproved !== "refuse" &&
                        regisData?.id &&
                        regisData?.slip_payment_url && (
                          <RefuseBtn
                            load={processing}
                            fetch={fetch}
                            regisData={regisData}
                          />
                        )}
                      {regisData?.isApproved !== "accept" && (
                        <button
                          disabled={processing}
                          onClick={handleAccept}
                          className="p-2.5 px-3.5 rounded-lg flex items-center gap-3.5 text-sm bg-blue-600 text-white"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="animate-spin" />
                              <p>กำลังดำเนินการ...</p>
                            </>
                          ) : (
                            <>
                              {" "}
                              <CheckCircle size={16} />
                              <p>อนุมัติ</p>
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )
                )}{" "}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ManageBtn;
