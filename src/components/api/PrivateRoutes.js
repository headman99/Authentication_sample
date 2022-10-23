import React, { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';
import { UserContext } from '../../App';
import { api,csrfToken } from './api';
const PrivateRoutes = ({ admin }) => {
    const { user,setUser } = useContext(UserContext);
    const [flag, setFlag] = useState(false)
    const allowUser = useRef(false)
    console.log('privateRoutes render')
    useEffect(()=>{
        var usr = user;
        if(!usr){
            const usrStorage = JSON.parse(secureLocalStorage.getItem('user'));
            setUser(usrStorage)
            usr = usrStorage; 
        }
        allowUser.current = usr?.info.isadmin == admin? true: false
        if(!api.defaults.headers.common.Authorization && usr){
            let accessToken  = usr.accessToken
            api.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            csrfToken().then(resp => {
                api.defaults.headers.common['X-CSRF-TOKEN'] = resp.data.token; 
            });
        }
        
        setFlag(true)
    },[user])

    if (flag) {
        return (
            allowUser.current? <Outlet /> : <Navigate to='/login' />
        )
    }
}


export default PrivateRoutes;