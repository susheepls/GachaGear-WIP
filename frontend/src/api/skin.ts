import Cookies from "js-cookie";
import { FetchSkinReq, OpenSkinCaseReq } from "../interface/CaseTypes";

const endpoint = import.meta.env.VITE_endpoint;

export const rollSkinCase = async(username: string) => {
    try{
        const token = Cookies.get('token');
        const getOneSkinReq = await fetch(endpoint + `${username}/skins`, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json',
            }
        });
        const getOneSkinResult: OpenSkinCaseReq = await getOneSkinReq.json();
        return getOneSkinResult.result;

    } catch(error) {
        console.error(error);
    }
}

export const fetchAccountSkins = async(username: string) => {
    try {
        const token = Cookies.get('token');
        const fetchAccountSkinsReq = await fetch(endpoint + `${username}/skins`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const allAccountSkins: FetchSkinReq = await fetchAccountSkinsReq.json();
        return allAccountSkins;

    } catch(error){
        console.error(error);
    }
}