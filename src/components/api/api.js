import axios from 'axios';
import { ROUTES } from './routes'
import { useNavigate } from 'react-router-dom';
//export const PATH = 'http://localhost/gestionale_dolci_BE/public/api';
export const PATH = 'http://localhost/gestionale_dolci/public/api';
//export const PATH = 'http://192.168.1.5/api';
//export const PATH = 'https://gestionale.hopto.org/api';
//export const PATH = 'https://2.47.119.204/api';


export const api = axios.create({
    baseURL: PATH,
    headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': "application/json",
        "Access-Control-Allow-Methods": 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Accept': 'application/json',
        'Cache-Control': 'private'
    }
});


export function resetHeaders(authorization, csrfToken) {
    api.defaults.headers.common = {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': "application/json",
        'Accept': 'application/json',
        Authorization: authorization,
        'X-CSRF-TOKEN': csrfToken
        //'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0'
    }
}

/*** GUSET ***/
export async function login(data) {
    return api.post(ROUTES.AUTH.LOGIN, data);
}


export async function logout() {
    return api.get(ROUTES.AUTH.LOGOUT);
}

export async function registerIngredient(data) {
    return api.post(ROUTES.ADMIN.REGISTER_INGREDIENT, data);
}

export async function csrfToken() {
    return api.get(ROUTES.AUTH.CSRF_TOKEN);
}

export async function getStock() {
    return api.get(ROUTES.ADMIN.GET_STOCK)
}

export async function removeIngredient(data) {
    return api.post(ROUTES.ADMIN.REMOVE_INGREDIENT, data)
}

export async function updateIngredientQuantity(data) {
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENT_QUANTITY, data)
}
export async function updateIngredientDescription(data) {
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENT_DESCRIPTION, data)
}

export async function addIngredientQuantity(data) {
    return api.post(ROUTES.ADMIN.ADD_INGREDIENT_QUANTITY, data)
}
export async function getProductsCatalog() {
    return api.get(ROUTES.ADMIN.GET_PRODUCTS_CATALOG);
}
export async function removeProduct(data) {
    return api.post(ROUTES.ADMIN.REMOVE_PRODUCT, data)
}
export async function registerProduct(data) {
    return api.post(ROUTES.ADMIN.REGISTER_PRODUCT, data)
}
export async function getProductGroups() {
    return api.get(ROUTES.ADMIN.GET_PRODUCT_GROUPS)
}
export async function getMenuCatalog(data) {
    return api.post(ROUTES.USER.GET_MENU_CATALOG, data)
}
export async function getMenuDetails() {
    return api.get(ROUTES.USER.GET_MENU_DETAILS)
}
export async function addMenuRecipe(data) {
    return api.post(ROUTES.ADMIN.ADD_MENU_RECIPE, data)
}
export async function removeMenuRecipe(data) {
    return api.post(ROUTES.ADMIN.REMOVE_MENU_RECIPE, data)
}
export async function updateMenuRecipeGroup(data) {
    return api.post(ROUTES.ADMIN.UPDATE_MENU_RECIPE_GROUP, data)
}

export async function updateMenuRecipeSection(data) {
    return api.post(ROUTES.ADMIN.UPDATE_MENU_RECIPE_SECTION, data)
}
export async function removeMenuRecipeSection(data) {
    return api.post(ROUTES.ADMIN.REMOVE_MENU_RECIPE_SECTION, data)
}
export async function removeMenuRecipeGroup(data) {
    return api.post(ROUTES.ADMIN.REMOVE_MENU_RECIPE_GROUP, data)
}
export async function getOrdersList(data) {
    return api.post(ROUTES.ADMIN.GET_ORDERS_LIST, data)
}
export async function getOrdersListByDate(data) {
    return api.post(ROUTES.ADMIN.GET_ORDERS_LIST_BY_DATE, data)
}

export async function getOpenProductsInstance(data) {
    return api.post(ROUTES.ADMIN.GET_OPEN_PRODUCTS_INSTANCE, data)
}
export async function getOrderListCodes(data) {
    return api.post(ROUTES.ADMIN.GET_ORDER_LIST_CODES, data)
}

export async function scanProduct(data) {
    return api.post(ROUTES.ADMIN.SCAN_PRODUCT, data)
}

export async function getProductsInstanceByFilter(data) {
    return api.post(ROUTES.ADMIN.GET_PRODUCTS_INSTANCE_BY_FILTER, data)
}

export async function getTeams() {
    return api.get(ROUTES.ADMIN.GET_TEAMS)
}

export async function getProductListByTeam(data) {
    return api.post(ROUTES.ADMIN.GET_PRODUCT_LIST_BY_TEAM,data)
}
export async function checkProductList(data) {
    return api.post(ROUTES.ADMIN.CHECK_PRODUCT_LIST,data)
}
export async function updateIngredient(data) {
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENT,data)
}

export async function updateProduct(data) {
    return api.post(ROUTES.ADMIN.UPDATE_PRODUCT,data)
}

export async function removeTeam(data) {
    return api.post(ROUTES.ADMIN.REMOVE_TEAM,data)
}

export async function updateTeam(data) {
    return api.post(ROUTES.ADMIN.UPDATE_TEAM,data)
}

export async function addTeam(data) {
    return api.post(ROUTES.ADMIN.ADD_TEAM,data)
}
export async function getProductstByTeam(data) {
    return api.post(ROUTES.ADMIN.GET_PRODUCTS_BY_TEAM,data)
}

export async function updateIngredientsTeam(data) {
    return api.post(ROUTES.ADMIN.UPDATE_INGREDIENTS_TEAM,data)
}
export async function getIngredientsTeam(data) {
    return api.post(ROUTES.ADMIN.GET_INGREDIENTS_TEAM,data)
}
export async function getTeamProductListByOrder(data) {
    return api.post(ROUTES.ADMIN.GET_PRODUCTS_LIST_BY_ORDER,data)
}
export async function getTeamIngredientsByProductRecipe(data) {
    return api.post(ROUTES.ADMIN.GET_TEAM_INGREDIENTS_BY_PRODUCT_RECIPE,data)
}

export async function getIngredientQuantityByOrder(data) {
    return api.post(ROUTES.ADMIN.GET_INGREDIENT_QUANTITY_BY_ORDER,data)
}



/************************************************** CUSTOMER *************************************************************** */
export async function addOrderMenu(data) {
    return api.post(ROUTES.CUSTOMER.ADD_ORDER_MENU, data)
}



