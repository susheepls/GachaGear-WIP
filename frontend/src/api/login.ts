import { NavigateFunction } from "react-router-dom";
import { AccountLoginType } from "../interface/accountTypes";
import Cookies from "js-cookie";

const endpoint = import.meta.env.VITE_endpoint;

export const loginFetch = async(loginCredentials: AccountLoginType) => {
    try {
        const request = await fetch(endpoint + 'accounts/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        })
        return request;
    } catch(error) {
        console.error('error' , error);
    }
}

export const getAccountFromToken = async(navigate?: NavigateFunction) => {
    try{
        const token = Cookies.get('token');
        if(!token) return;
        const request = await fetch(endpoint + 'current-user/', {
            headers: { 'Authorization' : `Bearer ${token}`}
        });
        if (!request.ok && navigate) {
            if(request.status === 401 || request.status === 403) navigate('/login');
            throw new Error('Failed to fetch user info');
        };
        const result = await request.json();
        return result;
    } catch(error) {
        console.error('error', error);
    }
}
