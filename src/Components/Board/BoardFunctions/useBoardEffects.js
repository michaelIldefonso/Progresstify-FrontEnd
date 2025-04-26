import { useEffect, useRef } from "react";
import { fetchUserData } from "../../Functions/fetchUserFunctions"; // Corrected path
import { getColumns } from "./columnFunctions"; // Corrected path

export const useColumnsEffect = (columns,) => {
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);
};

export const useFetchUserEffect = (location, navigate, setUser) => {
  useEffect(() => {
    fetchUserData(location, navigate, setUser);
  }, [navigate, location, setUser]);
};

export const useFetchColumnsEffect = (id, setColumns) => {
  const columnsFetchedRef = useRef(false);

  useEffect(() => {
    if (!columnsFetchedRef.current) {
      getColumns(id, setColumns, columnsFetchedRef);
    }
  }, [id, setColumns]);
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