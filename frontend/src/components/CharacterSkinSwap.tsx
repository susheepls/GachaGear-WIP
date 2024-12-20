import React, { SetStateAction, useEffect, useState } from 'react'
import { Skins } from '../interface/characterType';
import * as SkinsApi from '../api/skin';
import { FetchedSkinData } from '../interface/CaseTypes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Props {
    accountId: number,
    username: string,
    characterId: number,
    characterSkins: (Skins | null)[],
    accountSkins: FetchedSkinData[] | null
    setIsChangingSkins: React.Dispatch<SetStateAction<boolean>>
}

const CharacterSkinSwap: React.FC<Props> = (props) => {
    const [propEquippedSkinIds, setPropEquippedSkinIds] = useState<(number | null)[]>([null, null, null]);

    useEffect(() => {
        setStateofEquippedSkinIds();
    }, [props.accountSkins]);
    
    //set state that will be used to check if equipped
    const setStateofEquippedSkinIds = () => {
        let placeholder:(number|null)[] = [null, null, null];
    
        for(let i = 0; i < props.characterSkins.length; i++){
            if(props.characterSkins[i]){
                placeholder[i] = props.characterSkins[i]!.id
            }
        };
        setPropEquippedSkinIds(placeholder);
    }

    //handle if new checkmark clicked
    const handleNewEquippedSkinsState = (skin: FetchedSkinData) => {
        let copyStateArr = [...propEquippedSkinIds];
        if(skin.itemName.name === 'hat') {
            copyStateArr[0] = skin.id;
        } else if(skin.itemName.name === 'armor') {
            copyStateArr[1] = skin.id;
        } else {
            copyStateArr[2] = skin.id;
        }

        setPropEquippedSkinIds(copyStateArr);
    }

    //handle submit skin change
    const submitSkinChange = async() => {
        await SkinsApi.changeSkins(props.username, props.characterId, propEquippedSkinIds);
        props.setIsChangingSkins(false);
    }

    //handle border if selected
    const borderPicker = (skin: FetchedSkinData) => {
        const colorPicker: Record<string, string> = {
            'legendary': 'outline outline-2 outline-yellow',
            'epic': 'outline outline-2 outline-purple-600',
            'rare': 'outline outline-2 outline-blue-200',
            'common': 'outline outline-2 outline-three'
        };

        for(let number of propEquippedSkinIds){
            if(number === skin.id) return colorPicker[skin.rarity.name];
        }

        return;
    }

    //get skin img source 
    const handleSkinsSource = (skin: FetchedSkinData) => {
        if(skin && skin.rarity.name !== 'epic') {
            return `/skins/${skin.name}${skin.itemName.name}.png`;
        } else {
            return `/skins/${skin.name}${skin.itemName.name}.gif`;
        }
    }

    //show dropdown list of skins
    const handleSkinsDropDown = (itemType: string) => {
        const targetDropList = document.getElementById(`${itemType}-skins-container`);
        if(!targetDropList) return;
        if(targetDropList.classList.contains('hidden')){
            targetDropList.classList.remove('hidden');
            targetDropList.classList.add('flex');
            targetDropList.classList.add('flex-wrap');
            targetDropList.classList.add('justify-evenly');
        } else {
            targetDropList.classList.remove('flex');
            targetDropList.classList.remove('flex-wrap');
            targetDropList.classList.remove('justify-evenly');
            targetDropList.classList.add('hidden');
        }
    }

    function skinDivMaker(itemType: string) {
        const raritySort = ['legendary', 'epic', 'rare', 'common'];
   
        if(!props.accountSkins) return <div className='text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto animate-pulse'>Loading...</div>;
        if(props.accountSkins && props.accountSkins.length < 1) return <div className='text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto'>No Skins Available!</div>;
        
        const filteredSkins = props.accountSkins.filter((skin) => skin.itemName.name === itemType);
        filteredSkins.sort((a, b) => raritySort.indexOf(a.rarity.name) - raritySort.indexOf(b.rarity.name));

        return ( 
            <div className='px-2'>
                <div className='w-fit bg-three text-four mx-auto p-1 rounded-md mt-4' onClick={() => handleSkinsDropDown(itemType)}>
                    {itemType} Skins
                </div>
                <div id={itemType + '-skins-container'} className='hidden border-2 mt-1 rounded-md'>
                    {filteredSkins.map((skin, index) => 
                        <div key={index} className='flex mt-3'>
                            <div className={`rounded-md flex flex-col ${borderPicker(skin)}`} onClick={()=> handleNewEquippedSkinsState(skin)}>
                                <div className='flex'>
                                    <div className='w-fit mx-auto'>
                                        {skin.name.substring(0, skin.name.length-1)}
                                    </div>
                                </div>

                                <div className='w-20 h-fit'>
                                    <img className='mx-auto' src={handleSkinsSource(skin)}></img>
                                </div>
                                {skin.name.substring(skin.name.length - 1) !== '0' && 
                                    <div className='text-xs'>
                                        <div className='mx-auto w-fit bg-one text-four rounded-md p-1'>
                                            v{skin.name.substring(skin.name.length - 1)}
                                        </div> 
                                    </div>
                                }
                            </div>
                            {/* <div className='hidden'>
                                <input 
                                    checked={setInitiallyCheckmarkedSkins(skin.id)} 
                                    id={`skin-input-${skin.id}`} type='radio' 
                                    name={skin.itemName.name+'-skin'} 
                                    value={skin.id}
                                    onChange={() => handleNewEquippedSkinsState(skin)} 
                                />
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='absolute top-0 left-0 w-screen h-screen bg-five bg-opacity-30 z-50 flex justify-center overflow-y-scroll'>
            <div className='w-5/6 bg-four h-5/6 my-auto rounded-md overflow-scroll'>
                <div className='fixed text-four bg-two w-5 text-center rounded-md'>
                    <button onClick={() => props.setIsChangingSkins(false)}>X</button>
                </div>
                <div className='w-fit border-b-2 border-b-one mx-auto font-bold mt-3'>
                    Skin List
                </div>
                {skinDivMaker('hat')}
                {skinDivMaker('armor')}
                {skinDivMaker('sword')}
                <div className='bg-five p-1 w-fit mx-auto mt-3 text-four rounded-md active:bg-two'>
                    <button onClick={() => submitSkinChange()}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default CharacterSkinSwap