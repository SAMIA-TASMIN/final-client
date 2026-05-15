import axios from "axios";
import React from "react";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "https://final-server-coral.vercel.app/",
  });
  return axiosInstance;
};

export default useAxios;
