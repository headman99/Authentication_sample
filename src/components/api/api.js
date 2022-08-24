import axios from 'axios';
import { ROUTES } from './routes'


export const PATH = 'http://192.168.1.11:80/api';

export const api = axios.create({
    baseURL: PATH,
    headers:{  
        "Access-Control-Allow-Origin":"*",
        'Content-Type': "application/json",
        'Accept':'application/json',  
        'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'  
    }
});

export function resetHeaders(){
    api.defaults.headers.common = {
        "Access-Control-Allow-Origin":"*",
        'Content-Type': "application/json",
        'Accept':'application/json', 
        'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'
    }
}

/*** GUSET ***/
export async function login(data){
    return api.post(ROUTES.AUTH.LOGIN,data);
}


export async function logout(){
    return api.get(ROUTES.AUTH.LOGOUT);
}

export async function getToken(){
    return api.get(ROUTES.AUTH.GET_ACCESS_TOKEN);
}

export async function csrfToken(){
    return api.get(ROUTES.AUTH.CSRF_TOKEN);
}
