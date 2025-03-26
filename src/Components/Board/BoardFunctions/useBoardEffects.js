import { useEffect } from "react";
import { fetchUserData } from "../../Functions/fetchFunctions"; // Corrected path
import { getColumns } from "./columnFunctions"; // Corrected path

export const useDarkModeEffect = (darkMode, setDarkMode) => {
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
};

export const useColumnsEffect = (columns, setColumns) => {
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);
};

export const useFetchUserEffect = (location, navigate, setUser) => {
  useEffect(() => {
    fetchUserData(location, navigate, setUser);
  }, [navigate, location.search]);
};

export const useFetchColumnsEffect = (id, setColumns) => {
  useEffect(() => {
    getColumns(id, setColumns);
  }, [id]);
};