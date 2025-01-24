import { StaticIP } from "@/config/staticip";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
//import PropTypes from 'prop-types';



export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {


  /*const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null; // Pour le rendu côté serveur
  });*/

  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
  }   
}, []); // L'effet s'exécute uniquement côté client

  const register = async (formData) => {
    const res = await axios.post(`${StaticIP}api/auth/register`, formData);
    setCurrentUser(res.data);
    return res;
  };
  const login = async (formData) => {
    console.log('Envoi des données de connexion au serveur', formData);
    const res = await axios.post(`${StaticIP}api/auth/login`, formData, { withCredentials: true });
    console.log('Réponse reçue du serveur :', res);
    setCurrentUser(res.data);
    return res;
  };

  const logout = async () => {
    await axios.post(`${StaticIP}api/auth/logout`);
    setCurrentUser(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
}