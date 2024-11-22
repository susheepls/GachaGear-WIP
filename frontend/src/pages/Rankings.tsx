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
        
        return (
            <div className='flex m-1 flex-col outline-dashed'>
                <div className='mx-auto'>
                    Top Ranking for Total Substats
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

    const topTenRankingsDiv = (characterArray: CharacterDataForRankings[] | null) => {
        if(!characterArray || characterArray.length < 3) return <div>Loading...</div>;

        const getFourThroughTen = (characterArray: CharacterDataForRankings[]) => {
            for(let i = 3; i < 10 || i < characterArray.length ; i++ ) {
                return <div className='pl-2'>{i}. {characterArray[i].characterName}</div>
            }
        }

        return (
            <div className='flex flex-col mt-2 outline-dotted'>
                <div className='mx-auto'>
                    Top 10
                </div>
                {getFourThroughTen(characterArray)}
            </div>
        )
    }

    return (
        <div className='flex m-1 flex-col'>
            {topThreeRankingsDiv(allSubstatsRankings)}
            {topTenRankingsDiv(allSubstatsRankings)}
        </div>
    )
}

export default Rankings