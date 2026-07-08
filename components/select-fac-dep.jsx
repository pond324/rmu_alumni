import { useFacultyDep } from "@/hook/useFacultyDep";
import Select from "./select";
import { useEffect, useState } from "react";

export const SelectFaculty = ({
  loadData,
  setFacultyId,
  setDepartmentId,
  facultyId,
  setFaculty = () => {},
  width = "w-full lg:w-1/4",
}) => {
  const { faculties } = useFacultyDep();
  return (
    <Select
      loading={loadData}
      isDisabled={loadData}
      placeholder="ทุกคณะ"
      className={`z-19 col-span-5 text-sm ${width}`}
      options={faculties}
      value={faculties.find((f) => f?.value == facultyId) || null}
      onChange={(option) => {
        setFacultyId(option.value);
        setDepartmentId("");
        setFaculty(option);
      }}
      styles={{
        placeholder: (base) => ({
          ...base,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }),
        container: (base) => ({
          ...base,
          backgroundColor: "white",
        }),
      }}
    />
  );
};

export const SelectDepartment = ({
  loadData,
  facultyId,
  faculty,
  setDepartmentId,
  departmentId,
  width = "w-full lg:w-1/4",
}) => {
  const { departments } = useFacultyDep();
  const [departmentsList, setDepartmentList] = useState([]);
  useEffect(() => {
    setDepartmentList(departments);

    if (!departments || !facultyId) return;
    const normalizedData = departments.filter(
      (d) => d?.faculty_id === facultyId,
    );
    setDepartmentList(normalizedData);
  }, [departments, facultyId]);
  return (
    <Select
      loading={loadData}
      isDisabled={loadData}
      placeholder={facultyId ? `สาขาวิชาใน${faculty?.label}` : "ทุกสาขาวิชา"}
      className={`z-19 col-span-5 text-sm ${width}`}
      options={departmentsList}
      value={departmentsList.find((f) => f?.value == departmentId) || null}
      onChange={(option) => {
        setDepartmentId(option.value);
      }}
      styles={{
        placeholder: (base) => ({
          ...base,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }),
        container: (base) => ({
          ...base,
          backgroundColor: "white",
        }),
      }}
    />
  );
};
