import Cookies from "js-cookie";
import { lastAccountBoxOpenTime, lastAccountBoxOpenTimeSuccess } from "../interface/boxTimeTypes";

const endpoint = import.meta.env.VITE_endpoint;

export const getLastOpenedDate = async(username: string) => {
    try {
        const token = Cookies.get('token');

        const accountDailyBoxTimeFetch = await fetch(endpoint + `${username}/lastbox`, {
            method: 'GET',
            headers: { 'Authorization' : `Bearer ${token}`},
        });

        const lastAccountDailyBoxTime: lastAccountBoxOpenTime = await accountDailyBoxTimeFetch.json();
        if(!lastAccountDailyBoxTime) return;
        return lastAccountDailyBoxTime.result;

    } catch(error) {
        console.error(error);
    }
}

export const updateLastOpenedDate = async(username: string) => {
    try {
        const token = Cookies.get('token');

        const lastAccountBoxOpenUpdate = await fetch(endpoint + `${username}/lastbox`, {
            method: 'PATCH',
            headers: { 'Authorization' : `Bearer ${token}`},
        });

        const updateSuccess: lastAccountBoxOpenTimeSuccess = await lastAccountBoxOpenUpdate.json();
        if(!updateSuccess) return;
        return updateSuccess.result;

    } catch(error) {
        console.error(error);
    }
}