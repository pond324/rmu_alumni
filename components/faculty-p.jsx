export const facultyText = (faculties, facId) => {
  if (isNaN(Number(facId))) return facId;
  // console.log("🚀 ~ facultyText ~ facId:", facId?.substring(1, 2));
  // console.log("🚀 ~ facultyText ~ faculties:", faculties)
  return `${faculties?.find((f) => String(f?.id) == String(facId))?.name || "ไม่พบรหัสคณะนี้"}`;
};

export const departmentText = (departments, depId) => {
  if (isNaN(Number(depId))) return depId;

  return `สาขา${
    departments?.find((dep) => Number(dep?.id) === Number(depId))?.name ||
    "ไม่พบสาขาวิชานี้"
  }`;
};
