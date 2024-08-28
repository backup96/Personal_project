import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();
const PageContext = createContext("Form");

export const PageProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [page, setPage] = useState("Gate");

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </PageContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);
export const usePage = () => useContext(PageContext);
