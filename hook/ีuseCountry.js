import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useCountry() {
  const [countries, setCountries] = useState([]);
  const [load, setLoad] = useState(false);
  const [countryOptions, setCountryOPtions] = useState([]);

  const fetchCountry = async () => {
    setLoad(true);
    try {
      const res = await axios.get("https://countriesnow.space/api/v0.1/countries");
      setCountries(res?.data?.data);
      const options = res.data?.data.map((c) => ({
        label:c.country,
        value:c.country
      }))
      setCountryOPtions(options);
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  return {
    countries,
    load,
    countryOptions,
  };
}
