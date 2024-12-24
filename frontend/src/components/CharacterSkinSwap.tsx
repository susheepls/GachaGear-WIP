import React, { SetStateAction, useEffect, useState } from 'react'
import { Skins } from '../interface/characterType';
import * as SkinsApi from '../api/skin';
import { FetchedSkinData } from '../interface/CaseTypes';
import gsap from 'gsap';

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
    const backToDefault = async() => {
        setPropEquippedSkinIds([null, null, null]);
        await SkinsApi.backToDefault(props.username, props.characterId);
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

    //gsaps animate dropdown
    const animateDropDown = (itemType: string) => {
        const targetDiv = document.getElementById(`${itemType}-skins-container`);
        if(!targetDiv) return;
        if(targetDiv.classList.contains('hidden')){
            targetDiv.classList.remove('hidden');
            targetDiv.classList.add('flex');
            targetDiv.classList.add('flex-wrap');
            targetDiv.classList.add('justify-evenly');
            gsap.fromTo(targetDiv, 
                {
                    height: 0
                },
                {
                    height: "auto",
                    duration: 0.3,
                    opacity: 1,
                    ease: "power2.out",
                    onComplete: () => {
                        targetDiv.style.height = ""
                    } 
                }
            )
        }else {
            gsap.to(targetDiv, {
                height: 0,
                duration: 0.3,
                opacity: 0,
                onComplete: () => {
                    targetDiv.classList.remove("flex", "flex-wrap", "justify-evenly");
                    targetDiv.classList.add("hidden");
                    targetDiv.style.height = "";
                }
            })
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
                <div className='w-fit bg-three text-four mx-auto p-1 rounded-md mt-4 flex transition hover:bg-two cursor-pointer' onClick={() => animateDropDown(itemType)}>
                    <div>
                        {itemType} Skins
                    </div>
                    <div className='h-fit my-auto ml-1'>
                        <img src='/dropdown.svg'></img>
                    </div>
                </div>
                <div id={itemType + '-skins-container'} className='hidden border-2 mt-1 rounded-md'>
                    {filteredSkins.map((skin, index) => 
                        <div key={index} className='flex mt-3'>
                            <div className={`rounded-md flex flex-col ${borderPicker(skin)} cursor-pointer transition hover:outline hover:outline-2 hover:outline-two`} onClick={()=> handleNewEquippedSkinsState(skin)}>
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
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='absolute top-0 left-0 w-screen h-screen bg-five bg-opacity-30 z-50 flex justify-center overscroll-none'>
            <div className='w-5/6 bg-four h-5/6 my-auto rounded-md overflow-scroll lg:w-1/3'>
                <div className='relative'>
                    <div className='absolute -top-1 text-four bg-two w-5 text-center rounded-md'>
                        <button onClick={() => props.setIsChangingSkins(false)}>X</button>
                    </div>
                    <div className='w-fit border-b-2 border-b-one mx-auto font-bold mt-1'>
                        Skin List 
                    </div>
                </div>
                {skinDivMaker('hat')}
                {skinDivMaker('armor')}
                {skinDivMaker('sword')}
                <div className='bg-one p-1 w-fit mx-auto mt-3 text-four rounded-md active:bg-five text-xs transition hover:bg-two'>
                    <button onClick={() => backToDefault()}>Go back to default</button>
                </div>
                <div className='bg-five p-1 w-fit mx-auto mt-3 text-four rounded-md active:bg-two transition hover:bg-two'>
                    <button onClick={() => submitSkinChange()}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default CharacterSkinSwap