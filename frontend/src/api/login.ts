import { AccountLoginType } from "../interface/accountTypes";

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

