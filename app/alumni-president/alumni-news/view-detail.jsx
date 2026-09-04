import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import { Eye, EyeClosed, HeartHandshake, Newspaper, X } from "lucide-react";
import { useState } from "react";
import { sanitizeHtml } from "@/libs/sanitize";

const ViewDetail = ({ data,showText = true }) => {
  const [showModal, setShowModal] = useState(false);

  const onClose = () => setShowModal(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-linear-90 hover:text-white hover:from-blue-600 hover:to-sky-300 rounded-lg px-3 text-sm flex items-center gap-2"
      >
        <Eye size={18} />
        {showText && <p>ดูรายละเอียด</p>}
        
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="relative z-50 w-full lg:w-1/2 flex flex-col rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 px-8 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {data?.title}
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto p-8">
            {/* Cover */}
            <div className="overflow-hidden rounded-2xl">
              <img
                src={apiConfig.imgAPI + data?.thumnail}
                alt={data?.title}
                className="h-[350px] w-full object-cover"
              />
            </div>

            {/* Badge */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {data?.category == 0 ? (
                <span className="p-1 px-2 w-fit text-xs bg-blue-50 text-blue-500 rounded-full flex items-center gap-2">
                  <Newspaper size={16} />
                  <p>ข่าวสาร/กิจกรรม</p>
                </span>
              ) : (
                <span className="p-1 px-2 w-fit text-xs bg-red-50 text-red-500 rounded-full flex items-center gap-2">
                  <HeartHandshake size={16} />
                  <p>โครงการบริจาค</p>
                </span>
              )}

              {data?.isPublish ? (
                <span className="p-1 px-2 w-fit text-xs bg-green-50 text-green-500 rounded-full flex items-center gap-2">
                  <Eye size={16} />
                  <p>เผยแพร่อยู่</p>
                </span>
              ) : (
                <span className="p-1 px-2 w-fit text-xs bg-amber-50 text-amber-500 rounded-full flex items-center gap-2">
                  <EyeClosed size={16} />
                  <p>ฉบับร่าง</p>
                </span>
              )}

              <span className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 px-2 w-fit text-xs text-gray-600">
                <Eye size={15} />
                {data?.view?.toLocaleString() || 0} ครั้ง
              </span>
            </div>

            {data?.category == 1 && (
              <div className="mt-3 p-2 rounded-lg bg-pink-50 border border-red-300">
                <div className="flex justify-between text-sm mb-1.5">
                  <p>
                    ยอดบริจาคปัจจุบัน :{" "}
                    {data?.current_money?.toLocaleString() || 0} ฿
                  </p>
                  <p>
                    เป้าหมาย : {data?.target_money?.toLocaleString() || 0} ฿
                  </p>
                </div>

                <div className="w-full h-2.5 bg-gray-200 rounded-full mt-3.5">
                  <div
                    className="h-full bg-pink-500 relative"
                    style={{
                      width: `${
                        data?.target_money > 0
                          ? Math.min(
                              (data?.current_money / data?.target_money) * 100,
                              100,
                            )
                          : 0
                      }%`,
                    }}
                  >
                    <div className="absolute bottom-[-6px] right-0 p-1.5 text-xs rounded-lg text-white bg-pink-500">
                      {
                        <p className="font-semibold">
                          {data?.target_money > 0
                            ? `${Math.round(
                                (data?.current_money / data?.target_money) *
                                  100,
                              )}%`
                            : "0%"}
                        </p>
                      }
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1.5">
                  ปิดรับบริจาค: {DateTHFormat(data?.donate_end)}
                </p>
              </div>
            )}

            {/* Short Detail */}
            <div className="mt-8">
              <h3 className="mb-2 font-semibold ">รายละเอียดย่อ</h3>

              <p className="text-gray-700">{data?.short_detail}</p>
            </div>

            {/* Detail */}
            <div className="mt-8">
              <h3 className="mb-3 font-semibold ">รายละเอียดเต็ม</h3>

              <div className="rounded-lg border border-gray-300 shadow-xs bg-gray-50 p-5">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(data?.detail || ""),
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-700">
              แก้ไขล่าสุด: {DateTHFormat(data?.updatedAt)}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewDetail;
