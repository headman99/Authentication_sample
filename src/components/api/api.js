import axios from 'axios';
import { ROUTES } from './routes'


export const PATH = 'http://localhost/gestionale_dolci/public/api';

export const api = axios.create({
    baseURL: PATH,
    headers:{  
        "Access-Control-Allow-Origin":"*",
        'Content-Type': "application/json",
        'Accept':'application/json',   
        'Cache-Control':'private'
    }
});


export function resetHeaders(authorization,csrfToken){
    api.defaults.headers.common = {
        "Access-Control-Allow-Origin":"*",
        'Content-Type': "application/json",
        'Accept':'application/json',
        Authorization: authorization,
        'X-CSRF-TOKEN': csrfToken
        //'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'
    }


}

/*** GUSET ***/
export async function login(data){
    return api.post(ROUTES.AUTH.LOGIN,data);
}


export async function logout(){
    return api.get(ROUTES.AUTH.LOGOUT);
}

export async function registerIngredient(data){
    return api.post(ROUTES.ADMIN.REGISTER_INGREDIENT,data);
}

export async function csrfToken(){
    return api.get(ROUTES.AUTH.CSRF_TOKEN);
}

export async function getStock(){
    return api.get(ROUTES.ADMIN.GET_STOCK)
}

export async function removeIngredient(data){
    return api.post(ROUTES.ADMIN.REMOVE_INGREDIENT,data)
}

export async function updateIngredientQuantity(data){
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENT_QUANTITY,data)
}
export async function updateIngredientDescription(data){
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENT_DESCRIPTION,data)
}

export async function addIngredientQuantity(data){
    return api.post(ROUTES.ADMIN.ADD_INGREDIENT_QUANTITY,data)
}
export async function getProductsCatalog(){
    return api.get(ROUTES.ADMIN.GET_PRODUCTS_CATALOG);
}
export async function removeProduct(data){
    return api.post(ROUTES.ADMIN.REMOVE_PRODUCT,data)
}

