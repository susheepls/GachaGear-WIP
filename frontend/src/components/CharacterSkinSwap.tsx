import React, { useEffect, useState } from 'react'
import { Skins } from '../interface/characterType';
import * as SkinsApi from '../api/skin';
import { FetchedSkinData } from '../interface/CaseTypes';

interface Props {
    accountId: number,
    username: string,
    characterId: number,
    characterSkins: (Skins | null)[]
}

const CharacterSkinSwap: React.FC<Props> = (props) => {
    const [accountSkins, setAccountSkins] = useState<FetchedSkinData[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchAccountSkins();
    }, []);
    
    const fetchAccountSkins = async() => {
        const accountSkins = await SkinsApi.fetchAccountSkins(props.username);
        if(!accountSkins) return;

        if(accountSkins && accountSkins.result === null) setErrorMessage('No Skins!') ;
        else setAccountSkins(accountSkins.result);
    }
    
    //get skin img source 
    const handleSkinsSource = (skin: FetchedSkinData) => {
        if(skin && skin.rarity.name !== 'epic') {
            return `/skins/${skin.name}${skin.itemName.name}.png`;
        } else {
            return `/skins/${skin.name}${skin.itemName.name}.gif`;
        }
    }

    function skinDivMaker(itemType: string) {
        const raritySort = ['legendary', 'epic', 'rare', 'common'];
        if(!accountSkins) return;
        
        const filteredSkins = accountSkins.filter((skin) => skin.itemName.name === itemType);
        filteredSkins.sort((a, b) => raritySort.indexOf(a.rarity.name) - raritySort.indexOf(b.rarity.name));

        return ( 
            <div>
                <div>
                    {itemType} Skins
                </div>
                {filteredSkins.map((skin) => 
                <div>
                    <div>
                        {skin.name.substring(0, skin.name.length-1)}
                    </div>
                    <div>
                        <img className='scale-50' src={handleSkinsSource(skin)}></img>
                    </div>
                </div>
                )}
            </div>
        )
    }

    if(!accountSkins) return <div className='text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto animate-pulse'>Loading...</div>;

    return (
        <div className='absolute top-0 left-0 w-screen h-screen bg-five bg-opacity-30 z-50 flex justify-center'>
            <div className='w-5/6 bg-four h-5/6 my-auto rounded-md overflow-scroll'>
                <div className='w-fit border-b-2 border-b-one mx-auto font-bold mt-3'>
                    Skin List
                </div>
                {skinDivMaker('hat')}
                {skinDivMaker('armor')}
                {skinDivMaker('sword')}
            </div>
        </div>
    )
}

export default CharacterSkinSwap