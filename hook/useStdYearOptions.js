import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const UseStdYearOptions = () => {
  const [yearStartOptions, setYearStartOptions] = useState([]);
  const [yearEndOptions, setYearEndOptions] = useState([]);
  const [load, setLoad] = useState(true);

  const getYearOption = async () => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/year-options");

      if (res.status == 200) {
        const { yearEnd, yearStart } = res.data;
        // console.log("🚀 ~ getYearOption ~ res.data:", res.data)
        setYearEndOptions(yearEnd);
        setYearStartOptions(yearStart);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getYearOption();
  }, []);

  return {
    yearEndOptions,
    yearStartOptions,
    load,
  };
};
export default UseStdYearOptions;
