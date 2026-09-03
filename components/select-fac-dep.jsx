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
      className={`z-20 text-sm ${width}`}
      options={faculties}
      value={faculties.find((f) => f?.value == facultyId) || null}
      onChange={(option) => {
        setFacultyId(option.value);
        setDepartmentId("");
        setFaculty(option);
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "38px",
          height: "38px",
          borderRadius: "8px",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused
            ? "0 0 0 1px #3b82f6"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          "&:hover": {
            borderColor: "#9ca3af",
          },
        }),
        placeholder: (base) => ({
          ...base,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.875rem",
          color: "#6b7280",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0 8px",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "38px",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 50,
          borderRadius: "8px",
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
      className={`z-20 text-sm ${width}`}
      options={departmentsList}
      value={departmentsList.find((f) => f?.value == departmentId) || null}
      onChange={(option) => {
        setDepartmentId(option.value);
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "38px",
          height: "38px",
          borderRadius: "8px",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused
            ? "0 0 0 1px #3b82f6"
            : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          "&:hover": {
            borderColor: "#9ca3af",
          },
        }),
        placeholder: (base) => ({
          ...base,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.875rem",
          color: "#6b7280",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0 8px",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "38px",
        }),
        menu: (base) => ({
          ...base,
          zIndex: 50,
          borderRadius: "8px",
        }),
      }}
    />
  );
};
