import Cookies from "js-cookie";
import { AccountCharacters } from "../interface/characterType";
const endpoint = import.meta.env.VITE_endpoint;

export const fetchAccountCharacters = async(username: string) => {
    try {
        const backendURL = endpoint + `${username}/characters`;
        const token = Cookies.get('token');
        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        const accountCharactersInfo: AccountCharacters = await request.json();
        return accountCharactersInfo.result;

    } catch(error) {
        console.error(error);
    }
}