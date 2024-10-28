import Cookies from "js-cookie";
import { Currency, CurrencyDecreaseRequest, CurrencyIncreaseRequest } from "../interface/currencyTypes";
const endpoint = import.meta.env.VITE_endpoint;

export const getAccountCurrency = async(username: string) => {
    try {
        const token = Cookies.get('token');
        const fetchCurrency = await fetch(endpoint + `${username}/currency`, {
            headers: { 'Authorization' : `Bearer ${token}`},
        });
        const accountCurrency: Currency = await fetchCurrency.json();
        return accountCurrency.currency;
        
    } catch (error) {
        console.error(error);
    }
}

export const decreaseAccountCurrency = async(username: string, decreaseAmount: CurrencyDecreaseRequest) => {
    try {
        const token = Cookies.get('token');
        const decreaseCurrencyRequest = await fetch(endpoint + `${username}/currency/decrease`, {
            method: 'PATCH',
            headers: { 
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json' },
            body: JSON.stringify(decreaseAmount)
        });
        return await decreaseCurrencyRequest.json();

    } catch(error) {
        console.error(error);
    }
}

export const increaseAccountCurrency = async(username: string, increaseAmount: CurrencyIncreaseRequest) => {
    try {
        const token = Cookies.get('token');
        const increaseCurrencyRequest = await fetch(endpoint + `${username}/currency/increase`, {
            method: 'PATCH',
            headers: { 
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json' },
            body: JSON.stringify(increaseAmount)
        });
        return await increaseCurrencyRequest.json();
        
    } catch(error) {
        console.error(error);
    }
}