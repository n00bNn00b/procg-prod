import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

interface RequiredAuthProps {
  children: React.ReactNode;
}

const RequiredAuth = ({children}: RequiredAuthProps) => {
  const {token, setToken} = useGlobalContext();
  
  const getToken = (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  useEffect(()=> {
  const localToken =  getToken('token')
   setToken(localToken);
  }, [setToken])
  

  if (!token?.access_token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequiredAuth;
