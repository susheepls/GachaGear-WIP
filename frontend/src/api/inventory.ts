import Cookies from "js-cookie";
import { InventoryType } from "../interface/inventoryType";
import { NavigateFunction } from "react-router-dom";

const endpoint = import.meta.env.VITE_endpoint;

export const getAccountInventory = async(navigate: NavigateFunction) => {
    try {
        //get the stored token from the cookie
        const token = Cookies.get('token');
        if(!token) {
            navigate('/');
            throw new Error(`no auth token`);
        }

        //set the auth header with the jwt token
        const headers = { 'Authorization' : `Bearer ${token}` };
        const request = await fetch(endpoint + 'profile/', {headers: headers});

        //error handling
        if (!request.ok) {
            if (request.status === 401 || request.status === 403) {
                navigate('/');
            }
            throw new Error(`Failed with status ${request.status}`);
        }

        //im getting a message and the data so just get the data
        const inventory: InventoryType = await request.json();
        return inventory.accountInventory;

    } catch(err){
        console.error(err);
    }
}