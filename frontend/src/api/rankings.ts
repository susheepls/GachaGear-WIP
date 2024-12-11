import { AccountRankingsForCurrencyRes, allTotalSubstatsRankingsData } from "../interface/rankingTypes";

const endpoint = import.meta.env.VITE_endpoint;

const itemOrder = ['hat', 'armor', 'sword'];
const substatOrder = ['hp', 'def', 'atk'];

export const getAllTotalSubstatsRankings = async() => {
    try {
        const allTotalSubstatsRankingsReq = await fetch(endpoint + 'characters/rankings/totalsubstats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const allTotalSubstatsRankingsData: allTotalSubstatsRankingsData = await allTotalSubstatsRankingsReq.json();
        if(!allTotalSubstatsRankingsData) return;

        const rankingsData = allTotalSubstatsRankingsData.result;
        rankingsData.forEach((character) => character.equipment.sort((a, b) => itemOrder.indexOf(a.name.name) - itemOrder.indexOf(b.name.name)));
        rankingsData.forEach((character) => {
            character.equipment.forEach((item) => {
                item.substats.sort((a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
            })
        });
        return rankingsData;

    } catch(error) {
        console.error(error);
    }
}

export const getAllSubstatsTypeRankings = async(substatType: string) => {
    try {
        const substatsTypeRankingsReq = await fetch(endpoint + `characters/rankings/${substatType}`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });

        const substatTypeRankingsData: allTotalSubstatsRankingsData = await substatsTypeRankingsReq.json();
        if(!substatTypeRankingsData) return;

        const rankingsData = substatTypeRankingsData.result;
        rankingsData.forEach((character) => character.equipment.sort((a, b) => itemOrder.indexOf(a.name.name) - itemOrder.indexOf(b.name.name)));
        rankingsData.forEach((character) => {
            character.equipment.forEach((item) => {
                item.substats.sort((a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
            })
        });
        return rankingsData;


    } catch(error) {
        console.error(error);
    }
}

export const getAllAccountCurrencyRankings = async() => {
    try {
        const accountCurrencyRankingsReq = await fetch(endpoint + `accounts/rankings/currency`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const accountCurrencyRankingsData: AccountRankingsForCurrencyRes = await accountCurrencyRankingsReq.json();

        return accountCurrencyRankingsData.result;

    } catch(error) {
        console.error(error);
    }
}