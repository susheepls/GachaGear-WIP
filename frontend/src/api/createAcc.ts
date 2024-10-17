import { AccountLoginType } from "../interface/accountTypes";

const endpoint = import.meta.env.VITE_endpoint;

export const createAccRequest = async (createNewCredentials: AccountLoginType) => {
    try {
        const backendURL = endpoint + 'accounts/';
        const request = await fetch(backendURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createNewCredentials),
        });
        return request;

    } catch(error) {
        console.error(error);
    }
}