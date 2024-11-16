import Cookies from "js-cookie";
import { AccountCharacters, AddGearToCharacterReq, CreateCharacterReq, OneCharacter, RemoveGearFromCharacterReq } from "../interface/characterType";
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

export const fetchOneCharacter = async(username: string, characterId: string) => {
    try {
        const backendURL = endpoint + `${username}/characters/${characterId}`;
        const token = Cookies.get('token');
        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        const characterData: OneCharacter = await request.json();
        return characterData.result;

    } catch(error) {
        console.error(error);
    }
}

export const swapEquipItemOnCharacter = async(username: string, characterId: number, addGearToCharacter: AddGearToCharacterReq) => {
    try{
        const backendURL = endpoint + `${username}/characters/equip/${characterId}`;
        const token = Cookies.get('token');
        const request = await fetch(backendURL, {
            method: 'PATCH',
            headers: { 
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addGearToCharacter)
        });

        const addGearToCharacterRes = await request.json();
        return addGearToCharacterRes;

    } catch(error) {
        console.error(error);
    }
}

export const removeItemFromCharacter = async(username: string, characterId: number, removeGearFromChracter: RemoveGearFromCharacterReq) => {
    try {
        const backendURL = endpoint + `${username}/characters/unequip/${characterId}`;
        const token = Cookies.get('token');
        const request = await fetch(backendURL, {
            method: 'PATCH',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(removeGearFromChracter)
        });

        const removeGearFromCharacterRes = await request.json();
        return removeGearFromCharacterRes;

    } catch(error) {
        console.error(error);
    }
}

export const createCharacter = async(username: string, characterCreateForm: CreateCharacterReq) => {
    const backendURL = endpoint + `${username}/characters`;
    const token = Cookies.get('token');
    const request = await fetch(backendURL, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(characterCreateForm)
    });

    return request.json();
}

export const deleteCharacter = async(username: string, characterId: number) => {
    try {
        const backendURL = endpoint + `${username}/characters/${characterId}`;
        const token = Cookies.get('token');
        const request = await fetch(backendURL, {
            method:'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                characterId: characterId
            })
        });

        return request.json();
        
    } catch(error) {
        console.error(error);
    } 
}