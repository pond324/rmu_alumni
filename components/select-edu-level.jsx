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
      className={`z-15 text-sm ${width}`}
      options={eduList}
      value={eduList.find((f) => f?.value == selectEduLevel) || null}
      onChange={(option) => {
        setSelectEduLevel(option ? option.value : "");
      }}
      isClearable
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
export default SelectEduLevel;
