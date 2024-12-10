import { useState, useEffect } from 'react'
import * as RankingsApi from '../api/rankings';
import { CharacterDataForRankings } from '../interface/rankingTypes';
import SearchRankings from '../components/SearchRankings';
import { CreateCharacterReq, SearchedCharacters } from '../interface/characterType';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Rankings = () => {
    const navigate = useNavigate();
    const [allSubstatsRankings, setAllSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);
    const [atkSubstatsRankings, setAtkSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);
    const [hpSubstatsRankings, setHpSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);
    const [defSubstatsRankings, setDefSubstatsRankings] = useState<CharacterDataForRankings[] | null>(null);
    const [searchCharacterForm, setSearchCharacterForm] = useState<CreateCharacterReq>({ characterName: '' });
    const [searchedCharacterResult, setSearchedCharacterResult] = useState<SearchedCharacters[] | null>(null);

    useEffect(() => {
        fetchAllSubstatsRankings();
    }, []);

    useGSAP(() => {
        fadeInRankings();
    }, [allSubstatsRankings, atkSubstatsRankings, hpSubstatsRankings, defSubstatsRankings])

    const fetchAllSubstatsRankings = async() => {
        const allSubstatsRankingsData = await RankingsApi.getAllTotalSubstatsRankings();
        const atkSubstatsRankingsData = await RankingsApi.getAllSubstatsTypeRankings('atk');
        const hpSubstatsRankingsData = await RankingsApi.getAllSubstatsTypeRankings('hp');
        const defSubstatsRankingsData = await RankingsApi.getAllSubstatsTypeRankings('def');

        if(!allSubstatsRankingsData) return;
        if(!atkSubstatsRankingsData) return; 
        if(!hpSubstatsRankingsData) return;
        if(!defSubstatsRankingsData) return;

        setAllSubstatsRankings(allSubstatsRankingsData);
        setAtkSubstatsRankings(atkSubstatsRankingsData);
        setHpSubstatsRankings(hpSubstatsRankingsData);
        setDefSubstatsRankings(defSubstatsRankingsData);
    }

    //clicking on character in rankings takes you to their public profile
    const goToCharacterPage = (characterId: number) => {
        navigate(`/rankings/characters/${characterId}`);
    }

    const topThreeRankingsDiv = (characterArray: CharacterDataForRankings[] | null, category: string) => {
        if(!characterArray) return <div className='text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto animate-pulse'>Loading...</div>;
        
        return (
            <div id={category + '-top-three'} className='flex m-1 flex-col outline outline-3 outline-three pt-1'>
                <div className='mx-auto'>
                    Top Ranking for {category}
                </div>
                <div className='h-6 w-6 mx-auto'>
                    <svg className='h-6 w-6'>
                        <image href={svgChooser(category)}></image>
                    </svg>
                </div>
                <div id='top3-totalsubstats' className='flex flex-col'>
                    <div className='mx-auto' onClick={() => goToCharacterPage(characterArray[0].id)}>
                        {characterArray[0].characterName}
                    </div>
                    <div className='flex justify-evenly text-center'>
                        <div className='w-24' onClick={() => goToCharacterPage(characterArray[1].id)}>{characterArray[1].characterName}</div>
                        <div className='w-24' onClick={() => goToCharacterPage(characterArray[2].id)}>{characterArray[2].characterName}</div>
                    </div>
                </div>
            </div>
        )
    }

    const svgChooser = (category: string) => {
        if(category === 'Total Substats') return '/totalsubstats.svg';
        else if(category === 'Highest Atk') return '/highestatk.svg';
        else if(category === 'Highest HP') return '/highesthp.svg';
        else return '/highestdef.svg';
    }

    const topTenRankingsDiv = (characterArray: CharacterDataForRankings[] | null, category: string) => {
        if(!characterArray || characterArray.length < 3) return <div className='m-3 text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto animate-pulse'>Loading...</div>;

        const getFourThroughTen = (characterArray: CharacterDataForRankings[]) => {
            const copyOfCharacters = [...characterArray];
            const fourThroughTenCharacters = copyOfCharacters.slice(3);
            
            return fourThroughTenCharacters.map((character, index) => 
                <div key={index} className='ml-1' onClick={() => goToCharacterPage(character.id)}>{index + 3}. {character.characterName}</div>
            )
        }

        return (
            <div id={category + '-top-ten'} className='flex flex-col m-1 mb-4 outline outline-1 outline-three'>
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
            <div key={index} id={`character-result-${index}`} className='bg-four outline outline-three m-2 rounded-lg overflow-scroll active:bg-two active:text-four'
                onClick={() => navigate(`/rankings/characters/${character.id}`)}
            >
                {character.characterName}
            </div>
        )
    }

    //animation fade in for the rankings when they show up
    const fadeInRankings = () => {
        if(!allSubstatsRankings) return;
        if(!atkSubstatsRankings) return;
        if(!hpSubstatsRankings) return;
        if(!defSubstatsRankings) return;

        const top3TotalSubstats = document.getElementById('Total Substats-top-three');
        const top10TotalSubstats = document.getElementById('Total Substats-top-ten');
        const top3HighestAtk = document.getElementById('Highest Atk-top-three');
        const top10HighestAtk = document.getElementById('Highest Atk-top-ten');
        const top3HighestHp = document.getElementById('Highest HP-top-three');
        const top10HighestHp = document.getElementById('Highest HP-top-ten');
        const top3HighestDef = document.getElementById('Highest Def-top-three');
        const top10HighestDef = document.getElementById('Highest Def-top-ten');

        gsap.fromTo(top3TotalSubstats, 
            {
                opacity: 0
            },
            {
                opacity: 1
            }
        ),
        gsap.fromTo(top10TotalSubstats, 
            { 
                opacity: 0
            },
            {
                opacity: 1,
                delay: 0.7
            }
        ),
        gsap.fromTo(top3HighestAtk, 
            {
                opacity: 0
            },
            {
                opacity: 1,
                delay: 1.5
            }
        ),
        gsap.fromTo(top10HighestAtk, 
            { 
                opacity: 0
            },
            {
                opacity: 1,
                delay: 2.2
            }
        ),
        gsap.fromTo(top3HighestHp, 
            {
                opacity: 0
            },
            {
                opacity: 1,
                delay: 3
            }
        ),
        gsap.fromTo(top10HighestHp, 
            { 
                opacity: 0
            },
            {
                opacity: 1,
                delay: 3.5
            }
        ),
        gsap.fromTo(top3HighestDef, 
            {
                opacity: 0
            },
            {
                opacity: 1,
                delay: 4.2
            }
        ),
        gsap.fromTo(top10HighestDef, 
            { 
                opacity: 0
            },
            {
                opacity: 1,
                delay: 4.7
            }
        )
    }

    return (
        <div className='flex flex-col bg-four h-fit text-one'>
            {topThreeRankingsDiv(allSubstatsRankings, 'Total Substats')}
            {topTenRankingsDiv(allSubstatsRankings, 'Total Substats')}
            
            {topThreeRankingsDiv(atkSubstatsRankings, 'Highest Atk')}
            {topTenRankingsDiv(atkSubstatsRankings, 'Highest Atk')}

            {topThreeRankingsDiv(hpSubstatsRankings, 'Highest HP')}
            {topTenRankingsDiv(hpSubstatsRankings, 'Highest HP')}

            {topThreeRankingsDiv(defSubstatsRankings, 'Highest Def')}
            {topTenRankingsDiv(defSubstatsRankings, 'Highest Def')}

            <SearchRankings
                searchCharacterForm = {searchCharacterForm}
                setSearchCharacterForm = {setSearchCharacterForm}
                setSearchedCharacterResult = {setSearchedCharacterResult}
            />
            <div>
                {searchedCharacterResult && 
                <div className='fixed top-0 left-0 z-50 bg-pink-200 bg-opacity-70 w-full max-h-full h-full'>
                    <div className='bg-four outline outline-five p-6 mt-9 mb-auto mx-auto rounded shadow-lg w-7/12 h-1/2 flex flex-col text-center'>
                        <div className='mx-auto text-one border-b-2 border-one mb-1'>
                            Results
                        </div>
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
                        <div className='mt-auto mx-auto bg-three text-four w-9 rounded-lg active:bg-two'>
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