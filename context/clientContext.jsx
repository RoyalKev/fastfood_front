import axios from "axios";
import { createContext, useEffect, useState } from "react";
//import PropTypes from 'prop-types';


export const ClientContext = createContext();

export const ClientContextProvider = ({ children }) => {

  const [currentCustomer, setCurrentCustomer] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/client/login", inputs);
    setCurrentCustomer(res.data);
  };

  const logout = async (inputs) => {
    await axios.post("http://localhost:8800/auth/logout");
    setCurrentCustomer(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentCustomer));
  }, [currentCustomer]);

  return (
    <ClientContext.Provider value={{ currentCustomer, login, logout }}>
      {children}
    </ClientContext.Provider>
  );
}