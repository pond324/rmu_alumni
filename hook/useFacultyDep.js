import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const facIdNormalized = (name, facId) => {
  let returnFac = 1 + facId.substring(0, 1);
  switch (name) {
    case "คณะวิศวกรรมศาสตร์":
      returnFac = "21";
      break;
    case "คณะรัฐศาสตร์และรัฐประศาสนศาสตร์":
      returnFac = "62";
      break;
    default:
      break;
  }

  return returnFac;
};

export const useFacultyDep = () => {
  const [load, setLoad] = useState(true);
  const [loadData, setLoadData] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const fetchFaculty = async () => {
    try {
      const response = await axios.get(
        apiConfig.rmuAPI + "/president/get-facultys",
        { params: { isOptions: true } },
      );
      // console.log(response.data);
      setFaculties(
        response.data?.data?.map((f) => ({
          label: f?.faculty_name,
          value: f?.faculty_id,
        })),
      );
      console.log(
        response.data?.data?.map((f) => ({
          label: f?.faculty_name,
          value: f?.faculty_id,
        })),
      );
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  const fetchDepartments = async (dep_sheet_link) => {
    try {
      const response = await axios.get(
        apiConfig.rmuAPI + "/president/get-departments",
        {
          params: { isOptions: true },
        },
      );
      setDepartments(
        response.data?.data?.map((d) => ({
          faculty_id: d?.faculty?.faculty_id,
          label: d?.department_name,
          value: d?.department_id,
        })),
      );
      console.log(
        response.data?.data?.map((d) => ({
          faculty_id: d?.faculty?.faculty_id,
          label: d?.department_name,
          value: d?.department_id,
        })),
      );
    } catch (error) {
      console.error("Error fetching department data:", error);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  return { faculties, departments, loadData };
};
