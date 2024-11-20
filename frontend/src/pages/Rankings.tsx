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

    return (
        <div>Rankings</div>
    )
}

export default Rankings