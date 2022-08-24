import React,{useContext, useEffect} from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from '../../App';
const PrivateRoutes = ({admin}) => {
    const {user} = useContext(UserContext);
  
    return(
            user?.info.isadmin == admin? <Outlet /> : <Navigate to='/'/>
    )}

export default PrivateRoutes;