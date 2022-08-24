import React, { useEffect, useContext } from 'react'
import { UserContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import { login, api, resetHeaders } from '../../../components/api/api';
import './loading.css'
import { Audio } from 'react-loader-spinner'
const Loading = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        console.log('entro')
        setTimeout(() => {
            if (user) {
                const route = user.isadmin ? 'admin' : 'client'
                console.log('route', route)
                navigate(`/${route}`, {
                    replace: true
                })
                return;
            }

            const item = JSON.parse(secureLocalStorage.getItem('user'));
            var route = 'login';
            if (item) {
                setUser(item)
                api.defaults.headers.common.Authorization = 'Bearer ' + item.accessToken;
                api.defaults.headers.common['X-CSRF-TOKEN'] = item.csrfToken
                console.log(item)
                route = item.info.isadmin?'admin':'client';
            }
            navigate(`/${route}`,{
                replace:true
            });
        }, 1000)


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div id='mainContainer' style={{ height: '100%' }}>
            <div id='content'>
                <Audio
                    height="100"
                    width="100"
                    radius="9"
                    color='black'
                    secondaryColor='grey'
                    ariaLabel='three-dots-loading'
                />
            </div>



        </div>
    )
}

export default Loading