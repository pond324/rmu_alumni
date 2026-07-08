import axios from "axios";
import Select from "./select";
import { apiConfig } from "@/config/api.config";
import { useEffect, useState } from "react";
import { alerts } from "@/libs/alerts";

const SelectEduLevel = ({
  selectEduLevel,
  setSelectEduLevel,
  width = "w-full lg:w-1/4",
}) => {
  const [load, setLoad] = useState(false);
  const [eduList, setEdutList] = useState([]);
  const getEduList = async (search, page) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-edulevels",
        { params: { search, page, isOptions: true } },
      );
      if (res.status === 200) {
        setEdutList(
          res.data.data?.map((e) => ({
            label: e?.edu_level_name,
            value: e?.edu_levelId,
          })) || [],
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getEduList();
  }, []);

  return (
    <Select
      loading={load}
      isDisabled={load}
      placeholder={"ค้นหาระดับการศึกษา"}
      className={`z-19 col-span-5 text-sm ${width}`}
      options={eduList}
      value={eduList.find((f) => f?.value == selectEduLevel) || null}
      onChange={(option) => {
        setSelectEduLevel(option.value);
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
export default SelectEduLevel;
