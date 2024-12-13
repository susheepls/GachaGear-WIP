import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as CharacterApi from '../api/character';
import { SearchedCharacterDetails } from '../interface/characterType';

const PublicCharacterProfile = () => {
    const { characterid } = useParams();

    const [characterDetails, setCharacterDetails] = useState<SearchedCharacterDetails | null>(null);
    const [totalSubstatsRankings, setTotalSubstatsRankings] = useState<number | null>(null);
    const [atkRankings, setAtkRankings] = useState<number | null>(null);
    const [hpRankings, setHpRankings] = useState<number | null>(null);
    const [defRankings, setDefRankings] = useState<number | null>(null); 

    useEffect(() => {
        fetchCharacterDetails();
    }, []);

    useEffect(() => {
        fetchRankingsForTotalSubstats();
        fetchRankingsForAtk();
        fetchRankingsForHp();
        fetchRankingsForDef();
    }, [characterDetails]);

    const fetchCharacterDetails = async() => {
        const characterDetails = await CharacterApi.getSearchedCharacterDetails(Number(characterid));
        if(!characterDetails) return;
        setCharacterDetails(characterDetails);
    };

    //fetch functions for different categories
    const fetchRankingsForTotalSubstats = async() => {
        if(!characterDetails) return;
        const characterId = characterDetails.id;

        const characterRankings = await CharacterApi.getCharacterTotalSubstatRanking(characterId);

        if(!characterRankings) return;
        setTotalSubstatsRankings(characterRankings.result + 1);
    };
    const fetchRankingsForAtk = async() => {
        if(!characterDetails) return;
        const characterId = characterDetails.id;

        const characterRankings = await CharacterApi.getCharacterRankingNumberCategory(characterId, 'atk');

        if(!characterRankings) return;
        setAtkRankings(characterRankings.result + 1);
    };
    const fetchRankingsForHp = async() => {
        if(!characterDetails) return;
        const characterId = characterDetails.id;

        const characterRankings = await CharacterApi.getCharacterRankingNumberCategory(characterId, 'hp');

        if(!characterRankings) return;
        setHpRankings(characterRankings.result + 1);
    };
    const fetchRankingsForDef = async() => {
        if(!characterDetails) return;
        const characterId = characterDetails.id;

        const characterRankings = await CharacterApi.getCharacterRankingNumberCategory(characterId, 'def');

        if(!characterRankings) return;
        setDefRankings(characterRankings.result + 1);
    };

    //will use this for the other categories; the ranking spot is the state that will be assigned
    const rankNumberDivMaker = (rankingSpot: number | null, rankingCategory: string) => {
        if(!rankingSpot) return;
        return (
            <div className='flex justify-between text-one'>
                <div className='ml-2'>
                    {rankingCategory}
                </div>
                <div className='mr-2'>
                    # {rankingSpot}
                </div>
            </div>
        )
    }

    //svg chooser
    const svgChooser = (itemType: string) => {
        if(itemType === 'sword') return '/sword.svg';
        else if (itemType === 'armor') return '/armor.svg';
        else return '/hat.svg';
    }

    //exp to level converter
    const expToLevelConverter = (exp: number) => {
        if (exp < 10) return 0;
        if (exp < 30) return 1;
        if (exp < 60) return 2;
        if (exp < 100) return 3;
        return 'MAX';
    };

    const equipmentDivMaker = () => {
        if(!characterDetails) return;
        return characterDetails.equipment.map((item, index) => 
            <div key={index} id={`item-${index}`} className='flex flex-col outline outline-1 outline-one rounded-md mx-1 mt-1'>
                <div className='mx-auto'>
                    {item.name.name}
                </div>
                <div id={`item-picture-${index}`}>

                </div>
                <div className='mx-auto'>
                    {expToLevelConverter(item.exp)}
                </div>
                <div>
                    <svg className='w-3 h-3 mx-auto'>
                        <image href={svgChooser(item.name.name)}></image>
                    </svg>
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
                <div id='character-loaded-container' className='flex flex-col bg-four'>
                    <div className="mx-auto text-one text-lg font-bold outline-double outline-three p-1 mt-2 rounded-sm">
                        {characterDetails.characterName}
                    </div>
                    <div id='character-picture' className='relative h-fit overflow-hidden'>
                        <div className='w-full p-2'>
                            <img className='mx-auto' src='/charactersprites/character.png'></img>
                            <img className='h-fit absolute top-3 left-1/2 transform -translate-x-1/3' src='/charactersprites/defaulthat.png'></img>
                            <img className='h-fit absolute top-1/2 left-1/2 transform -translate-x-[47%] translate-y-[12%]' src='/charactersprites/defaultarmor.png'></img>
                            <img className='h-fit w-fit absolute top-1/2 left-[31%] transform -translate-x-1/3 lg:left-1/2 lg:-translate-x-24' src='/charactersprites/defaultsword.png'></img>
                        </div>
                    </div>
                    <div id='equipments' className='flex flex-col m-1'>
                        <div className='mx-auto w-24 bg-three text-four rounded-md text-center mt-1 mb-1 p-1'>
                            Equipment
                        </div>
                        <div className='flex mx-auto'>
                            {equipmentDivMaker()}
                        </div>
                    </div>
                </div>
            )}
                <div className='flex flex-col m-3 mx-1 outline outline-1 outline-three rounded-md'>
                    <div className='flex bg-three text-four w-28 justify-center mx-auto rounded-md mt-2'>
                        <div className='rounded-md w-16'>
                            Rankings
                        </div>
                        <div className='mt-1 ml-1'>
                            <svg className='h-4 w-4'>
                                <image stroke='white' href='/trophywhite.svg'></image>
                            </svg>
                        </div>

                    </div>

                    {!totalSubstatsRankings ? (
                        <div>loading...</div>
                    ):(
                        <div id='ranking-categories'>
                            <div id='all-rankings-numbers-container'>
                                {rankNumberDivMaker(totalSubstatsRankings, 'Total Substats')}
                            </div>
                            <div>
                                {rankNumberDivMaker(atkRankings, 'Highest Atk')}
                            </div>
                            <div>
                                {rankNumberDivMaker(hpRankings, 'Highest HP')}
                            </div>
                            <div>
                                {rankNumberDivMaker(defRankings, 'Highest Def')}
                            </div>
                        </div>
                    )}

                </div>
        </div>
    )
}

export default PublicCharacterProfile