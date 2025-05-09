import { useEffect, useRef } from "react";
import { fetchUserData } from "../../Functions/fetchFunctions"; 
import { getColumns } from "./columnFunctions"; 

// Custom React hook to persist columns in localStorage whenever they change
export const useColumnsEffect = (columns,) => {
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);
};

// Custom React hook to fetch user data whenever the location or navigation changes
export const useFetchUserEffect = (location, navigate, setUser) => {
  useEffect(() => {
    fetchUserData(location, navigate, setUser);
  }, [navigate, location, setUser]);
};

// Custom React hook to fetch columns for a specific board ID and update the state
export const useFetchColumnsEffect = (id, setColumns) => {
  const columnsFetchedRef = useRef(false);

  useEffect(() => {
    if (!columnsFetchedRef.current) {
      getColumns(id, setColumns, columnsFetchedRef);
    }
  }, [id, setColumns]);
};

// Adds a wheel event listener to enable horizontal scrolling for the columns container while allowing vertical scrolling inside card lists
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