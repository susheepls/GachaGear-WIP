import { useState, useEffect } from 'react'
import * as RankingsApi from '../api/rankings';
import { CharacterDataForRankings } from '../interface/rankingTypes';
import SearchRankings from '../components/SearchRankings';
import { CreateCharacterReq, SearchedCharacters } from '../interface/characterType';
import { useNavigate } from 'react-router-dom';

const Rankings = () => {
    const navigate = useNavigate();
    const [allSubstatsRankings, setAllSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);
    const [searchCharacterForm, setSearchCharacterForm] = useState<CreateCharacterReq>({ characterName: '' });
    const [searchedCharacterResult, setSearchedCharacterResult] = useState<SearchedCharacters[] | null>(null);

    useEffect(() => {
        fetchAllSubstatsRankings();
    }, []);

    const fetchAllSubstatsRankings = async() => {
        const allSubstatsRankingsData = await RankingsApi.getAllTotalSubstatsRankings();
        if(!allSubstatsRankingsData) return;
        setAllSubstatsRankings(allSubstatsRankingsData);
    }

    const topThreeRankingsDiv = (characterArray: CharacterDataForRankings[] | null, category: string) => {
        if(!characterArray) return <div>Loading...</div>;
        
        return (
            <div className='flex m-1 flex-col outline-dashed'>
                <div className='mx-auto'>
                    Top Ranking for {category}
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

    const searchResultsCharactersDiv = () => {
        if(!searchedCharacterResult) return;
        if(searchedCharacterResult.length < 1) return <div>Character not Found!</div>
        return searchedCharacterResult.map((character, index) => 
            <div key={index} id={`character-result-${index}`} className='bg-four m-1 rounded-lg'
                onClick={() => navigate(`/rankings/characters/${character.id}`)}
            >
                {character.characterName}
            </div>
        )
    }

    return (
        <div className='flex m-1 flex-col'>
            {topThreeRankingsDiv(allSubstatsRankings, 'Total Substats')}
            {topTenRankingsDiv(allSubstatsRankings)}
            <SearchRankings
                searchCharacterForm = {searchCharacterForm}
                setSearchCharacterForm = {setSearchCharacterForm}
                setSearchedCharacterResult = {setSearchedCharacterResult}
            />
            <div>
                {searchedCharacterResult && 
                <div className='fixed top-0 left-0 z-50 bg-pink-200 bg-opacity-70 w-full max-h-full h-full'>
                    <div className='bg-five p-6 mt-9 mb-auto mx-auto rounded shadow-lg w-7/12 h-1/2 flex flex-col justify-between text-center'>
                        <div id='search-results-container' className='overflow-scroll'>
                            {!searchedCharacterResult && (
                                <div>
                                    Character Not Found
                                </div>
                            )}
                            {searchedCharacterResult && (
                                <div id='search-results-characters' className='flex flex-col'>
                                    {searchResultsCharactersDiv()}
                                </div>
                            )}
                        </div>
                        <div className='relative bottom-0'>
                            <button onClick={() => setSearchedCharacterResult(null)}>Exit</button>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default Rankings