import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as CharacterApi from '../api/character';
import { SearchedCharacterDetails } from '../interface/characterType';

const PublicCharacterProfile = () => {
    const { characterid } = useParams();

    const [characterDetails, setCharacterDetails] = useState<SearchedCharacterDetails | null>(null);
    const [totalSubstatsRankings, setTotalSubstatsRankings] = useState<number | null>(null); 

    useEffect(() => {
        fetchCharacterDetails();
    }, []);

    useEffect(() => {
        fetchRankingsForTotalSubstats();
    }, [characterDetails]);

    const fetchCharacterDetails = async() => {
        const characterDetails = await CharacterApi.getSearchedCharacterDetails(Number(characterid));
        if(!characterDetails) return;
        setCharacterDetails(characterDetails);
    };

    const fetchRankingsForTotalSubstats = async() => {
        if(!characterDetails) return;
        const characterId = characterDetails.id;

        const characterRankings = await CharacterApi.getCharacterTotalSubstatRanking(characterId);

        if(!characterRankings) return;
        setTotalSubstatsRankings(characterRankings.result + 1);
    }

    //will use this for the other categories; the ranking spot is the state that will be assigned
    const rankNumberDivMaker = (rankingSpot: number | null, rankingCategory: string) => {
        if(!rankingSpot) return;
        return (
            <div className='flex justify-between'>
                <div>
                    {rankingCategory}
                </div>
                <div>
                    # {rankingSpot}
                </div>
            </div>
        )
    }

    const equipmentDivMaker = () => {
        if(!characterDetails) return;
        return characterDetails.equipment.map((item, index) => 
            <div key={index} id={`item-${index}`} className='flex flex-col outline outline-1 mx-1 mt-1'>
                <div className='mx-auto'>
                    {item.name.name}
                </div>
                <div id={`item-picture-${index}`}>

                </div>
                <div className='mx-auto'>
                    {item.exp}
                </div>
                <div className='flex text-center'>
                    <div className='w-9 flex flex-col'>
                        <div>
                            {item.substats[0].substatType.name}
                        </div>
                        <div>
                            {item.substats[0].value}
                        </div>
                    </div>
                    <div className='w-9 flex flex-col'>
                        <div>
                            {item.substats[1].substatType.name}
                        </div>
                        <div>
                            {item.substats[1].value}
                        </div>
                    </div>
                    <div className='w-9 flex flex-col'>
                        <div>
                            {item.substats[2].substatType.name}
                        </div>
                        <div>
                            {item.substats[2].value}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-four'>
            {!characterDetails ? (
                <div>Loading...</div>
            ) : (
                <div id='character-loaded-container' className='flex flex-col'>
                    <div>
                        {characterDetails.characterName}
                    </div>
                    <div id='character-picture' className='h-96 overflow-hidden'>
                        <div className='w-full p-2'>
                            <img src='../../public/Luce_mascot.png'></img>
                        </div>
                    </div>
                    <div id='equipments' className='flex flex-col m-1'>
                        <div className='mx-auto'>
                            Equipment
                        </div>
                        <div className='flex mx-auto'>
                            {equipmentDivMaker()}
                        </div>
                    </div>
                </div>
            )}
                <div className='flex flex-col m-3 mx-1 outline outline-1'>
                    <div className='mx-auto'>
                        Rankings
                    </div>

                    {!totalSubstatsRankings ? (
                        <div>loading...</div>
                    ):(
                        <div id='all-rankings-numbers-container'>
                            {rankNumberDivMaker(totalSubstatsRankings, 'Total Substats')}
                        </div>
                    )}

                </div>
        </div>
    )
}

export default PublicCharacterProfile