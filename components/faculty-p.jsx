export const facultyText = (faculties, facId) => {
  if (isNaN(Number(facId))) return facId;
  // console.log("🚀 ~ facultyText ~ facId:", facId?.substring(1, 2));
  // console.log("🚀 ~ facultyText ~ faculties:", faculties)
  return `${faculties?.find((f) => String(f?.value) == String(facId))?.label || "ไม่พบรหัสคณะนี้"}`;
};

export const departmentText = (departments, depId) => {
  if (isNaN(Number(depId))) return depId;

  return `สาขา${
    departments?.find((dep) => Number(dep?.value) === Number(depId))?.label ||
    "ไม่พบสาขาวิชานี้"
  }`;
};
