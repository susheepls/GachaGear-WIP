import Cookies from "js-cookie";
import { currency } from "../components/NavBar";
const endpoint = import.meta.env.VITE_endpoint;

export const getAccountCurrency = async(username: string) => {
    try {
        const token = Cookies.get('token');
        const fetchCurrency = await fetch(endpoint + `${username}/currency`, {
            headers: { 'Authorization' : `Bearer ${token}`},
        });
        const accountCurrency: currency = await fetchCurrency.json();
        return accountCurrency.currency;
        
    } catch (error) {
        console.error(error);
    }
}