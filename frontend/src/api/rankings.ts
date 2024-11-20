import { allTotalSubstatsRankingsData } from "../interface/rankingTypes";

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