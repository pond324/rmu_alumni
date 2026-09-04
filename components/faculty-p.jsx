export const facultyText = (faculties, facId) => {
  if (!facId) return "ไม่พบข้อมูล";
  const found = faculties?.find(
    (f) =>
      String(f?.value) === String(facId) ||
      String(f?.id) === String(facId) ||
      String(f?.faculty_id) === String(facId),
  );
  return found?.label || found?.name || found?.faculty_name || facId;
};

export const departmentText = (departments, depId) => {
  if (!depId) return "ไม่พบข้อมูล";
  const found = departments?.find(
    (dep) =>
      String(dep?.value) === String(depId) ||
      String(dep?.id) === String(depId) ||
      String(dep?.department_id) === String(depId),
  );
  if (found) {
    const name = found?.label || found?.name || found?.department_name || depId;
    return name.startsWith("สาขา") ? name : `สาขา${name}`;
  }
  return depId;
};
