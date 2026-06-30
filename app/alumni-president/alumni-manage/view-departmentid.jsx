import Modal from "@/components/modal";
import RowLoader from "@/components/row-loader";
import { SelectDepartment, SelectFaculty } from "@/components/select-fac-dep";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { BookUser, ListRestart, X } from "lucide-react";
import { useEffect, useState } from "react";

const ViewDepartment = () => {
  const { departments, loadData } = useFacultyDep();
  const [departmentList, setDepartmentList] = useState(departments);
  const [showModal, setShowModal] = useState(false);
  const [facultyId, setFacultyId] = useState("");
  const [faculty, setFaculty] = useState(null);
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    setDepartmentList(departments);
  }, [departments, loadData]);

  useEffect(() => {
    if (!departments || !facultyId) return;
    let normalizedData = departmentList;
    if (facultyId) {
      normalizedData = departments.filter((d) =>
        [62, 28].includes(Number(facultyId))
          ? d?.id?.startsWith(facultyId)
          : Number(facultyId) === 16
            ? d?.id?.startsWith("61")
            : Number(facultyId) === 12
              ? Number(d?.id.substring(0, 4)) > 2000 &&
                Number(d?.id.substring(0, 4)) < 2029
              : Number(facultyId) === 21
                ? Number(d?.id.substring(0, 4)) > 2028 &&
                  Number(d?.id.substring(0, 4)) < 3000
                : d?.id?.substring(1, 2) == 0 &&
                  d?.id?.substring(0, 1) == String(facultyId)?.substring(1, 2),
      );
    }
    if (departmentId) {
      normalizedData = normalizedData.filter(
        (d) => d?.id === departmentId || d?.value === departmentId,
      );
    }
    setDepartmentList(normalizedData);
  }, [facultyId, departmentId]);

  const resetSearch = () => {
    setFaculty(null);
    setFacultyId(null);
    setDepartmentId(null);
    setDepartmentList(departments);
  };
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
      >
        <BookUser size={16} />
        <p>ดูรหัสสาขา</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/2  rounded-lg z-50 bg-white flex flex-col">
          <div className="w-full flex p-5 items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold">รหัสสาขาวิชา</p>
              <p className="text-gray-700 text-sm">
                ข้อมูลรหัสสาขาวิชาและชื่อสาขาวิชา ที่ระบบรองรับ
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="p-5 pt-5 border-t border-gray-300 w-full">
            <div className="flex items-center flex-wrap w-full gap-2">
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
            <p className="mt-2 text-sm text-gray-600">
              ทั้งหมด {departmentList.length} สาขาวิชา
            </p>
            <div className="w-full h-[300px] lg:h-[400px] mt-2.5 overflow-auto ">
              {" "}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 sticky top-0">
                    <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                      รหัส
                    </th>
                    <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                      สาขาวิชา
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadData ? (
                    <RowLoader numcol={2} />
                  ) : (
                    departmentList?.map((f, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="p-2.5 pb-3 text-start text-sm border-r border-gray-300">
                          {f?.id}
                        </td>
                        <td className="p-2.5 pb-3 text-start text-sm">
                          {f?.name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewDepartment;
