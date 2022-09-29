import React, { useEffect, useContext } from 'react'
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage'
import '../../css/loading.css'
import { Audio } from 'react-loader-spinner'
import { api } from '../../components/api/api';
const Loading = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        setTimeout(() => {
            if (user) {
                const route = user.isadmin ? 'admin' : 'client'
                navigate(`/${route}`, {
                    replace: true
                })
            } else {
                const item = JSON.parse(secureLocalStorage.getItem('user'));
                var route = 'login';
                if (item) {
                    setUser(item)
                    api.defaults.headers.common.Authorization = 'Bearer ' + item.accessToken;
                    api.defaults.headers.common['X-CSRF-TOKEN'] = item.csrfToken
                    route = item.info.isadmin ? 'admin' : 'client';
                }
                navigate(`/${route}`, {
                    replace: true
                });
            }


        }, 1000)


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div id='mainContainer'>
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