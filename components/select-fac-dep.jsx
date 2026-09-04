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
  faculties: propFaculties,
}) => {
  const hookData = useFacultyDep();
  const faculties = propFaculties || hookData.faculties || [];
  const isLoading = loadData !== undefined ? loadData : hookData.loadData;

  return (
    <Select
      isClearable
      isSearchable
      loading={isLoading}
      isDisabled={isLoading}
      placeholder="ทุกคณะ"
      className={`z-30 text-sm ${width}`}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      options={faculties}
      value={
        faculties.find((f) => String(f?.value) === String(facultyId)) || null
      }
      onChange={(option) => {
        setFacultyId(option ? option.value : "");
        setDepartmentId("");
        setFaculty(option || null);
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
          zIndex: 9999,
          borderRadius: "8px",
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
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
  departments: propDepartments,
}) => {
  const hookData = useFacultyDep();
  const departments = propDepartments || hookData.departments || [];
  const isLoading = loadData !== undefined ? loadData : hookData.loadData;
  const [departmentsList, setDepartmentList] = useState([]);

  useEffect(() => {
    if (!departments || departments.length === 0) {
      setDepartmentList([]);
      return;
    }
    if (!facultyId) {
      setDepartmentList(departments);
      return;
    }
    const normalizedData = departments.filter(
      (d) => String(d?.faculty_id) === String(facultyId),
    );
    setDepartmentList(normalizedData);
  }, [departments, facultyId]);

  return (
    <Select
      isClearable
      isSearchable
      loading={isLoading}
      isDisabled={isLoading}
      placeholder={
        facultyId && faculty?.label
          ? `สาขาวิชาใน${faculty.label}`
          : "ทุกสาขาวิชา"
      }
      className={`z-20 text-sm ${width}`}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      options={departmentsList}
      value={
        departmentsList.find(
          (f) => String(f?.value) === String(departmentId),
        ) || null
      }
      onChange={(option) => {
        setDepartmentId(option ? option.value : "");
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
          zIndex: 9999,
          borderRadius: "8px",
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  );
};

