import Cookies from "js-cookie";
import { EnhanceItemExp } from "../interface/itemType";
const endpoint = import.meta.env.VITE_endpoint;

export const enhanceItem = async(username: string, itemId: string, expAmount: EnhanceItemExp) => {
    try {
        const token = Cookies.get('token');

        const request = await fetch(endpoint + `${username}/inventory/enhance/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(expAmount)
        });

        //if request is not ok
        if(!request.ok) {
            if(request.status === 406) {
                return { message: 'Invalid EXP Amount' };
            }
            if(request.status === 403) {
                return { message: 'Unauthorized'};
            }
            throw new Error(`Failed with status ${request.status}`);
        }

        const item = await request.json();
        return item;
        
    } catch(error) {
        console.error(error);
    }
}