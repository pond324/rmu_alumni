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

const FACULTY_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZzv2CzWL8KZsrF4skEyDrCeiDVLy8XEji7MNI8oxGxBh34Pogpsr69fy6KCKomQ/pub?output=csv";
const DEPARTMENT_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgGDU9zsZ_T5f5uxBQq2Jd8PNfgLj4yGQEr-KJOqgxokumjyEgZPcpAHoxElMJ1A/pub?output=csv";

export const useFacultyDep = () => {
  const [load, setLoad] = useState(true);
  const [loadData, setLoadData] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const fetchFaculty = async (fac_sheet_link) => {
    try {
      const response = await axios.get(fac_sheet_link);
      // console.log(response.data);
      setFaculties([
        ...response.data
          .split("\n")
          .slice(1)
          .map((r) => {
            const col = r.split(",");
            return {
              id: facIdNormalized(
                col[1]?.trim().replace(/\r/g, ""),
                String(col[0]?.trim()),
              ),
              name: col[1]?.trim().replace(/\r/g, ""),
            };
          })
          .filter((f) => f.id && f.name),
        ,
        { id: 17, name: "คณะเทคโนโลยีสารสนเทศ" },
        { id: 28, name: "บัณฑิตวิทยาลัย" },
      ]);
      // console.log(`🚀 ~ fetchFaculty ~ [
      //   ...response.data
      //     .split("\n")
      //     .slice(1)
      //     .map((r) => {
      //       const col = r.split(",");
      //       return {
      //         id: facIdNormalized(
      //           col[1]?.trim().replace(/\r/g, ""),
      //           String(col[0]?.trim()),
      //         ),
      //         name: col[1]?.trim().replace(/\r/g, ""),
      //       };
      //     })
      //     .filter((f) => f.id && f.name),
      //   ,
      //   { id: 17, name: "คณะเทคโนโลยีสารสนเทศ" },
      //   { id: 28, name: "บัณฑิตวิทยาลัย" },
      // ]:`, [
      //   ...response.data
      //     .split("\n")
      //     .slice(1)
      //     .map((r) => {
      //       const col = r.split(",");
      //       return {
      //         id: facIdNormalized(
      //           col[1]?.trim().replace(/\r/g, ""),
      //           String(col[0]?.trim()),
      //         ),
      //         name: col[1]?.trim().replace(/\r/g, ""),
      //       };
      //     })
      //     .filter((f) => f.id && f.name),
      //   ,
      //   { id: 17, name: "คณะเทคโนโลยีสารสนเทศ" },
      //   { id: 28, name: "บัณฑิตวิทยาลัย" },
      // ])
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  const fetchDepartments = async (dep_sheet_link) => {
    try {
      const response = await axios.get(dep_sheet_link);
      setDepartments(
        response.data
          .split("\n")
          .slice(2)
          .map((r) => {
            const col = r.split(",");
            return {
              id: col[0]?.trim(),
              name: col[1]?.trim().replace(/\r/g, ""),
            };
          })
          .filter((f) => f.id && f.name),
      );
    } catch (error) {
      console.error("Error fetching department data:", error);
    } finally {
      setLoadData(false);
    }
  };

  const [settingData, setSettingData] = useState(null);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
        { withCredentials: true },
      );
      if (res.status === 200) {
        fetchFaculty(res?.data?.fac_sheet_link);
        fetchDepartments(res?.data?.dep_sheet_link);
        // console.log("🚀 ~ getData ~ res?.data:", res?.data)
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return { faculties, departments, loadData };
};
