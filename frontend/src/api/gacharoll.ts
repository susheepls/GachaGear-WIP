
import Cookies from "js-cookie";
import { Item } from "../interface/inventoryType";

const endpoint = import.meta.env.VITE_endpoint;

export const rollGacha = async() => {
    try {
        const token = Cookies.get('token');
        const request = await fetch(endpoint + 'gacharoll', {
            headers: { 'Authorization': `Bearer ${token}`},
            method: 'POST',
        });
        if(!request.ok) throw new Error(`Failed with status ${request.status}`);
        const newItem: Item = await request.json();
        return newItem;
    } catch (error) {
        console.error(error);
    }
}