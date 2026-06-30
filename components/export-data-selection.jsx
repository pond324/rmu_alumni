import { Download, ListRestart, Trash, Trash2, X } from "lucide-react";
import Modal from "./modal";
import SelectExportFileType from "./select-export-file-type";
import { SelectDepartment, SelectFaculty } from "./select-fac-dep";
import { useState } from "react";
import { departmentText, facultyText } from "./faculty-p";
import { usePathname } from "next/navigation";

const ExportDataSelection = ({
  showModal,
  setShowModal,
  fileName,
  setFileName,
  otherSelectIion,
  loadData,
  facultyId,
  faculty,
  setDepartmentId,
  setFaculty,
  setFacultyId,
  departmentId,
  resetSearch,
  selectFileType,
  setSelectFileType,
  handleSelectAllFacId,
  selecetFacultyId,
  faculties,
  faultyList,
  handleSelectFacultyId,
  handleSelectAllDepId,
  selectDepartmentId,
  departments,
  departmentList,
  handleSelectDepId,
  handleSelectAllYearStart,
  selectYearStart,
  yearStartOptions,
  exportData,
  handleSelectYearStart,
  sectionHeder,
  sectionDes,
  showSelectYear = true
}) => {
  const [showSelectFacModal, setShowSelectFacModal] = useState(false);
  const [showSelectDepModal, setShowSelectDepModal] = useState(false);
  const pathName = usePathname();
  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full md:w-1/2 rounded-lg bg-white flex flex-col z-50">
          <div className="w-full flex items-start p-5 border-b border-gray-300 justify-between">
            <span className="flex flex-col">
              <p className="font-semibold">{sectionHeder}</p>
              <p className="text-sm text-gray-700">{sectionDes}</p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="w-full flex flex-col h-[500px] overflow-auto">
            {" "}
            <div className="p-5 flex flex-col w-full">
              <p className="text-sm">ชื่อไฟล์</p>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                type="text"
                className="w-full p-2 mt-1.5 px-3 rounded-lg text-sm border border-gray-300 shadow-xs focus:border-blue-500"
                placeholder="เช่น ไฟล์รายชื่อ_2569"
              />
              <p className="text-sm mt-3">เลือกรูปแบบไฟล์</p>
              <SelectExportFileType
                selectFileType={selectFileType}
                setSelectFileType={setSelectFileType}
              />
            </div>
            <div className="w-full border-t border-gray-200 p-5 flex flex-col">
              {otherSelectIion}

              <p className="text-sm mt-3.5">คณะ/สาขาวิชา</p>
              <div className="flex items-center mt-2 flex-wrap w-full gap-2">
                <p className="text-sm">ค้นหา:</p>
                <SelectFaculty
                  facultyId={facultyId}
                  loadData={loadData}
                  setDepartmentId={setDepartmentId}
                  setFacultyId={setFacultyId}
                  setFaculty={setFaculty}
                />
                <SelectDepartment
                  departmentId={departmentId}
                  faculty={faculty}
                  facultyId={facultyId}
                  loadData={loadData}
                  setDepartmentId={setDepartmentId}
                />
                <button
                  onClick={resetSearch}
                  className="p-2 flex items-center gap-2.5 px-3 rounded-lg text-sm bg-gray-50 hover:bg-gray-200 shadow-sm"
                >
                  <ListRestart size={18} />
                  ล้างการค้นหา
                </button>
              </div>
              <div className="mt-2 w-full flex items-center gap-5">
                <div className="flex flex-col flex-1">
                  {" "}
                  <div className="w-full flex lg:items-center flex-col lg:flex-row justify-between">
                    <p className="text-sm text-gray-700">คณะ</p>
                    <span
                      onClick={handleSelectAllFacId}
                      className="hover:underline cursor-pointer flex items-center text-sm text-blue-500 gap-2"
                    >
                      <input
                        checked={selecetFacultyId.length === faculties.length}
                        type="checkbox"
                        readOnly
                        className="w-3.5 h-3.5 cursor-pointer"
                      />
                      <p>เลือกทั้งหมด</p>
                    </span>
                  </div>
                  <div className="flex w-full text-sm  h-[300px] overflow-auto gap-1 mt-1.5 p-2.5 rounded-lg border border-gray-300 shadow-xs flex-col">
                    {faultyList.map((f, index) => (
                      <button
                        onClick={() => handleSelectFacultyId(f?.id)}
                        key={index}
                        className="flex items-center gap-2.5 text-start"
                      >
                        <input
                          checked={selecetFacultyId?.includes(f?.id)}
                          readOnly
                          type="checkbox"
                          className="w-3.5 h-3.5 cursor-pointer"
                        />
                        <p>{f?.name}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSelectFacModal(true)}
                    className="text-blue-500 bg-blue-50 text-xs mt-1.5 hover:bg-blue-100 hover:shadow-xs w-fit rounded-full p-1.5 px-3"
                  >
                    เลือกแล้ว {selecetFacultyId.length} คณะ
                  </button>
                </div>
                <div className="flex flex-col flex-1">
                  {" "}
                  <div className="w-full flex lg:items-center flex-col lg:flex-row justify-between">
                    <p className="text-sm text-gray-700">สาขาวิชา</p>
                    <span
                      onClick={handleSelectAllDepId}
                      className="hover:underline cursor-pointer flex items-center text-sm text-blue-500 gap-2"
                    >
                      <input
                        readOnly
                        checked={
                          selectDepartmentId.length === departments.length
                        }
                        type="checkbox"
                        className="w-3.5 h-3.5 cursor-pointer"
                      />
                      <p>เลือกทั้งหมด</p>
                    </span>
                  </div>
                  <div className="flex w-full h-[300px] overflow-auto text-sm mt-1.5 gap-1 p-2.5 rounded-lg border border-gray-300 shadow-xs flex-col">
                    {departmentList.map((f, index) => (
                      <span
                        onClick={() => handleSelectDepId(f?.id)}
                        key={index}
                        className="flex items-center cursor-pointer gap-2.5"
                      >
                        <input
                          checked={selectDepartmentId.includes(f?.id)}
                          readOnly
                          type="checkbox"
                          className="w-3.5 h-3.5 cursor-pointer"
                        />
                        <p className="text-start"> {f?.name}</p>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSelectDepModal(true)}
                    className="text-blue-500 bg-blue-50 text-xs mt-1.5 hover:bg-blue-100 hover:shadow-xs w-fit rounded-full p-1.5 px-3"
                  >
                    เลือกแล้ว {selectDepartmentId.length} สาขาวิชา
                  </button>
                </div>
              </div>

              {pathName !== "/alumni-president/personels-manage" && pathName !== "/alumni-president/admin-manage" &&  (
                <>
                  <p className="text-sm mt-3.5">ปีการศึกษา</p>
                  <div className="mt-2 w-full flex items-center gap-5">
                    <div className="flex flex-col flex-1">
                      {" "}
                      <div className="w-full flex lg:items-center flex-col lg:flex-row justify-between">
                        <span
                          onClick={handleSelectAllYearStart}
                          className=" hover:underline cursor-pointer flex items-center text-sm text-blue-500 gap-2"
                        >
                          <input
                            readOnly
                            checked={
                              selectYearStart.length === yearStartOptions.length
                            }
                            type="checkbox"
                            className="w-3.5 h-3.5 cursor-pointer"
                          />
                          <p>เลือกทั้งหมด</p>
                        </span>
                      </div>
                      <div className="flex w-full text-sm  h-[300px] overflow-auto gap-1 mt-1.5 p-2.5 rounded-lg border border-gray-300 shadow-xs flex-col">
                        {yearStartOptions?.map((f, index) => (
                          <span
                            onClick={() => handleSelectYearStart(f)}
                            key={index}
                            className="flex items-center gap-2.5 cursor-pointer"
                          >
                            <input
                              checked={selectYearStart.includes(f)}
                              readOnly
                              type="checkbox"
                              className="w-3.5 h-3.5 cursor-pointer"
                            />
                            <p>{f}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full p-5 border-t border-gray-300 flex gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg p-2 px-3.5 text-sm border border-gray-300 shadow-sm"
            >
              ปิด
            </button>
            <button
              onClick={exportData}
              className="rounded-lg p-2 px-3.5 text-sm border border-blue-300 flex items-center gap-2 bg-blue-500 text-white shadow-sm"
            >
              <Download size={18} />
              <p>ส่งออกรายงาน</p>
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showSelectFacModal}
        onClose={() => setShowSelectFacModal(false)}
      >
        <div className="z-50 w-full lg:w-1/2 bg-white p-5 rounded-lg flex flex-col">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="font-bold">รายชื่อคณะที่เลือก</p>
              <p className="text-sm text-gray-700">
                เลือกแล้ว {selecetFacultyId.length} คณะ
              </p>
            </span>
            <button
              onClick={() => setShowSelectFacModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="mt-3.5 pt-3.5 border-t overflow-auto border-gray-300 w-full flex items-center flex-wrap gap-2.5">
            <div className="w-full flex items-center flex-wrap gap-3.5">
              {" "}
              {selecetFacultyId.map((f, index) => (
                <span
                  key={index}
                  className="text-blue-500 flex items-center gap-2 bg-blue-50 text-xs mt-1.5 hover:bg-blue-100 hover:shadow-xs w-fit rounded-full p-1.5 px-3"
                >
                  {facultyText(faculties, f)}
                  <button
                    onClick={() => handleSelectFacultyId(f)}
                    className="p-1.5 hover:text-red-500 rounded-lg bg-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showSelectDepModal}
        onClose={() => setShowSelectDepModal(false)}
      >
        <div className="z-50 w-full lg:w-1/2 bg-white p-5 rounded-lg flex flex-col">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="font-bold">รายชื่อสาขาวิชาที่เลือก</p>
              <p className="text-sm text-gray-700">
                เลือกแล้ว {selectDepartmentId.length} สาขาวิชา
              </p>
            </span>
            <button
              onClick={() => setShowSelectDepModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="mt-3.5 pt-3.5 h-[400px] gap-y-1 border-t overflow-auto border-gray-300 w-full flex items-center flex-wrap gap-2.5">
            <div className="w-full flex items-center flex-wrap gap-3.5">
              {" "}
              {selectDepartmentId.map((f, index) => (
                <span
                  key={index}
                  className="text-blue-500 flex items-center gap-2 bg-blue-50 text-xs mt-1.5 hover:bg-blue-100 hover:shadow-xs w-fit rounded-full p-1.5 px-3"
                >
                  {departmentText(departments, f)}
                  <button
                    onClick={() => handleSelectDepId(f)}
                    className="p-1.5 hover:text-red-500 rounded-lg bg-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ExportDataSelection;
