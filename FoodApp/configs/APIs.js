import axios from "axios";

const BASE_URL = 'https://nguyenmax007.pythonanywhere.com';
export const endpoints = {
    popularFoods: '/foods/random-foods/',
    stores: '/stores/'
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