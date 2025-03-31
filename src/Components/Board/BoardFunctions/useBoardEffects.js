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

export const useScrollBarEffect = (columnsContainerRef, scrollbarRef) => {
  useEffect(() => {
    const columnsContainer = columnsContainerRef.current;
    if (columnsContainer) {
      const handleWheel = (e) => {
        // Allow vertical scrolling inside card lists
        if (e.target.closest(".card-list")) {
          console.log("Mouse is inside card list, allowing vertical scrolling");
          return;
        }

        // Horizontal scrolling logic
        e.preventDefault();
        columnsContainer.scrollLeft += e.deltaY;
      };

      columnsContainer.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        columnsContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, [columnsContainerRef, scrollbarRef]);
};