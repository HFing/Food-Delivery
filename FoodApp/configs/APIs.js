import axios from "axios";

const BASE_URL = 'https://nguyenmax007.pythonanywhere.com';

export const endpoints = {
    popularFoods: '/foods/random-foods/',
    stores: '/stores/',
    storeDetails: (storeId) => `/stores/${storeId}/`,
    storeFoods: (storeId) => `/stores/${storeId}/foods/`,
    foodDetails: (foodId) => `/foods/${foodId}/`,
    register: '/users/',
    login: '/o/token/',
    updateUser: '/users/update/',
    'current-user': '/users/current-user/',
    menuDetails: (menuId) => `/menus/${menuId}/`,

};

export const authApis = (token) => {
    console.info("TEST")
    console.info(token);
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});