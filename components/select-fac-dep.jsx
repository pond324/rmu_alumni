import { useFacultyDep } from "@/hook/useFacultyDep";
import Select from "./select";
import { useEffect, useState } from "react";

export const SelectFaculty = ({
  loadData,
  setFacultyId,
  setDepartmentId,
  facultyId,
  setFaculty = () => {},
}) => {
  const { faculties } = useFacultyDep();
  return (
    <Select
      loading={loadData}
      isDisabled={loadData}
      placeholder="ทุกคณะ"
      className="z-19 col-span-5 text-sm w-full lg:w-1/4"
      options={faculties.map((f) => ({
        label: f.name,
        value: f.id,
      }))}
      value={
        faculties
          .map((f) => ({
            label: f?.name,
            value: f?.id,
          }))
          .find((f) => f?.value == facultyId) || null
      }
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
}) => {
  const { departments } = useFacultyDep();
  const [departmentsList, setDepartmentList] = useState([]);
  useEffect(() => {
    setDepartmentList(
      departments.map((f) => ({
        label: f?.name,
        value: f?.id,
      })),
    );

    if (!departments || !facultyId) return;
    const normalizedData = departments
      .filter((d) =>
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
      )
      .map((d) => ({
        label: d?.name,
        value: d?.id,
      }));
    setDepartmentList(normalizedData);
  }, [departments, facultyId]);
  return (
    <Select
      loading={loadData}
      isDisabled={loadData}
      placeholder={facultyId ? `สาขาวิชาใน${faculty?.label}` : "ทุกสาขาวิชา"}
      className="z-15 col-span-5 w-full lg:w-1/4 text-sm"
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
