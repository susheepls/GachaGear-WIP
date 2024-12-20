import Cookies from "js-cookie";
import { AccountCharacters, AddGearToCharacterReq, CreateCharacterReq, OneCharacter, RankingNumber, RemoveGearFromCharacterReq, SearchCharacterRes, SearchedCharacterDetailsRes, SearchItemOwner } from "../interface/characterType";
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

    return await request.json();
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

        return await request.json();
        
    } catch(error) {
        console.error(error);
    } 
}

export const searchCharacterByName = async(targetCharacter: string) => {
    try {
        const backendURL = endpoint + `characters/rankings/search/${targetCharacter}`;
        const request = await fetch(backendURL, {
            method:'GET',
            headers: {
                'Content-Type':'application/json',
            },
        });
    
        const searchResults: SearchCharacterRes = await request.json(); 
    
        if (!searchResults) return null;
        else if(searchResults.message === 'Character Not Found') return [];
        else return searchResults.result;

    } catch(error) {
        console.error(error);
    }
}

export const getSearchedCharacterDetails = async(characterId: number) => {
    try {
        const backendURL = endpoint + `characters/rankings/details/${characterId}`;
        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const characterDetails: SearchedCharacterDetailsRes = await request.json();
        if(!characterDetails) return;

        return characterDetails.result;

    } catch(error) {
        console.error(error);
    } 
}

export const getCharacterTotalSubstatRanking = async(characterId: number) => {
    try {
        const backendURL = endpoint + `characters/rankings/totalsubstats/${characterId}`;
        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const characterRank: RankingNumber = await request.json();
        
        return characterRank;

    } catch(error) {
        console.error(error);
    }
}

export const getItemOwnerCharacterName = async(username: string, characterId: number) => {
    try{
        const backendURL = endpoint + `${username}/characters/items/${characterId}`;
        const token = Cookies.get('token');

        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const itemOwner: SearchItemOwner = await request.json();
        if(!itemOwner) return;

        return itemOwner.result.characterName;

    } catch(error) {
        console.error(error);
    }
}

export const getCharacterRankingNumberCategory = async(characterId: number, category: string) => {
    //cateory should be either atk, def, or hp
    try {
        const backendURL = endpoint + `characters/rankings/${category}/${characterId}`;

        const request = await fetch(backendURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const characterRank: RankingNumber = await request.json();

        return characterRank;

    } catch(error) {
        console.error(error);
    }
}