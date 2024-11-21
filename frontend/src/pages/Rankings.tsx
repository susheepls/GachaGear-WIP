import React, { useState, useEffect } from 'react'
import * as RankingsApi from '../api/rankings';
import { CharacterDataForRankings } from '../interface/rankingTypes';

const Rankings = () => {
    const [allSubstatsRankings, setAllSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);

    useEffect(() => {
        fetchAllSubstatsRankings();
    }, []);

    const fetchAllSubstatsRankings = async() => {
        const allSubstatsRankingsData = await RankingsApi.getAllTotalSubstatsRankings();
        if(!allSubstatsRankingsData) return;
        setAllSubstatsRankings(allSubstatsRankingsData);
    }

    const topThreeRankingsDiv = (characterArray: CharacterDataForRankings[] | null) => {
        if(!characterArray) return <div>Loading...</div>;
        console.log(Object.keys(characterArray))
        return (
            <div className='flex m-1 flex-col outline-dashed'>
                <div className='mx-auto'>
                    Top Ranking for Substats
                </div>
                <div id='top3-totalsubstats' className='flex flex-col'>
                    <div className='mx-auto'>
                        {characterArray[0].characterName}
                    </div>
                    <div className='flex justify-evenly text-center'>
                        <div className='w-24'>{characterArray[1].characterName}</div>
                        <div className='w-24'>{characterArray[2].characterName}</div>
                    </div>
                </div>
            </div>
        )
        
    }

    return (
        <div className='flex m-1 flex-col'>
            {topThreeRankingsDiv(allSubstatsRankings)}
        </div>
    )
}

export default Rankings