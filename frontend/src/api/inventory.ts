import Cookies from "js-cookie";
import { EnhanceOneItemType, GetOneItemTypeRes, InventoryType } from "../interface/inventoryType";
import { NavigateFunction } from "react-router-dom";

const endpoint = import.meta.env.VITE_endpoint;

export const getAccountInventory = async(navigate: NavigateFunction, username: string) => {
    try {
        //get the stored token from the cookie
        const token = Cookies.get('token');
        if(!token) {
            navigate('/');
            throw new Error(`no auth token`);
        }

        //set the auth header with the jwt token
        const headers = { 'Authorization' : `Bearer ${token}` };
        const request = await fetch(endpoint + `${username}/inventory`, {headers: headers});

        //error handling
        if (!request.ok) {
            if (request.status === 401 || request.status === 403) {
                navigate('/');
            }
            throw new Error(`Failed with status ${request.status}`);
        }

        //im getting a message and the data so just get the data
        const inventory: InventoryType = await request.json();
        return inventory;

    } catch(err){
        console.error(err);
    }
}

export const getOneItem = async(username: string, itemId: number) => {
    try {
        const token = Cookies.get('token');

        const headers = { 'Authorization' : `Bearer ${token}` };
        const request = await fetch(endpoint + `${username}/inventory/enhance/${itemId}`, {headers: headers});

        //if request is not ok
        if(!request.ok) {
            if(request.status === 403 || request.status === 404) {
                return { message: 'Invalid URL', result: null };
            }
            throw new Error(`Failed with status ${request.status}`);
        }
        
        const item: EnhanceOneItemType = await request.json();
        return item;

    } catch(error) {
        console.error(error);
    }
}

export const deleteItem = async(username: string, itemId: number) => {
    try {
        const token = Cookies.get('token');

        const deleteRequest = await fetch(endpoint + `${username}/inventory/sell/${itemId}`, {
            method:'DELETE',
            headers: { 'Authorization' : `Bearer ${token}` }
        });

        const deletedItem = await deleteRequest.json();
        return deletedItem;

    } catch(error) {
        console.error(error);
    }
}

export const getAccountItemsByType = async(username: string, itemType: string) => {
    try {
        const token = Cookies.get('token');

        const getItemsByTypeReq = await fetch(endpoint + `${username}/inventory/types/${itemType}`, {
            method: 'GET',
            headers: { 'Authorization' : `Bearer ${token}` },
        });

        const accountItemsByType: GetOneItemTypeRes = await getItemsByTypeReq.json();
        if(!accountItemsByType) return
        return accountItemsByType.result;

    } catch(error) {
        console.error(error);
    }
}