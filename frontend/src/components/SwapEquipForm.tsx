import React, { SetStateAction, useEffect, useState } from 'react'
import { Item } from '../interface/inventoryType'
import * as InventoryApi from '../api/inventory'
import _ from 'lodash';
import * as CharacterApi from '../api/character'
import gsap from 'gsap';

interface Props {
    itemType: string,
    itemData: Item | null,
    username: string | null,
    characterId: number | null,
    setUpdatedItem: React.Dispatch<SetStateAction<boolean>>,
    updatedItem: boolean,
    expToLvlConverter: (exp: number) => number | string;
}

const SwapEquipForm: React.FC<Props> = (props) => {
    const [itemTypes, setItemTypes] = useState<Item[] | null>(null);
    const [sortingType, setsortingType] = useState<string>('default');
    const [isFilterClicked, setIsFilterClicked] = useState<boolean>(false);

    useEffect(() => {
        fetchItemType();
    }, [props.itemType, props.itemData, props.setUpdatedItem])

    const fetchItemType = async() => {
        const itemType = props.itemType;
        
        const username = props.username;
        if(!username) return;

        const itemsByType = await InventoryApi.getAccountItemsByType(username, itemType);

        if(!itemsByType) return;
        //sorting of result
        itemsByType.sort((a,b) => a.id - b.id);
        const orderType = ['atk', 'hp', 'def'];
        itemsByType.forEach((item) => {
            item.substats.sort((a , b) => orderType.indexOf(a.substatType.name) - orderType.indexOf(b.substatType.name) );
        })

        if(!itemsByType) return;
        setItemTypes(itemsByType);
    }

    const handleUpdatedItem = () => {
        !props.updatedItem ? props.setUpdatedItem(true) : props.setUpdatedItem(false);
    }
    const swapItemEquippedSubmit = async(username: string, itemId: number, swapItemId?: number) => {
        if(!props.characterId) return;
        const swapEquipForm = { characterId: props.characterId, itemId: itemId, swapItemId: (swapItemId ? swapItemId : null) };
        
        await CharacterApi.swapEquipItemOnCharacter(username, props.characterId, swapEquipForm);

        handleUpdatedItem();
        fetchItemType();
    }

    const removeItemFromCharacterSubmit = async(itemId: number) => {
        if(!props.username) return;
        if(!props.characterId) return;

        const removeItemBody = { characterId: props.characterId, itemId: itemId };

        await CharacterApi.removeItemFromCharacter(props.username, props.characterId, removeItemBody);

        handleUpdatedItem();
        fetchItemType();
    }

    //sorting functions switch case
    const sortItems = (sortingType: string) => {
        
        setsortingType(sortingType);
        if(!itemTypes) return;

        //use a copy of the original fetched items
        const sortedItems = [...itemTypes];
        
        switch(sortingType) {
            case 'idAsc':
                sortedItems.sort((a, b) => a.id - b.id);
                break;
            case 'idDes':
                sortedItems.sort((a, b) => b.id - a.id);
                break;
            case 'sortByHighestLevel':
                sortedItems.sort((a, b) => b.exp - a.exp);
                break;
            case 'sortByLowestLevel':
                sortedItems.sort((a, b) => a.exp - b.exp);
                break;
            default : 
                sortedItems.sort((a, b) => a.id - b.id);
                break;
        }

        setItemTypes(sortedItems);
    }
    //button press that changes sort type
    const handleSortButtonClick = (sortingType: string) => {
        sortItems(sortingType);
    }

    const handleFilterButtonPress = () => {
        const filterSvg = document.getElementById('filter-svg');
        const filterList = document.getElementById('filter-list');
        if(!filterSvg) return;
        if(!filterList) return;

        if(!isFilterClicked) {
            setIsFilterClicked(true);
            filterList.classList.remove('pointer-events-none');
            
            gsap.fromTo(filterSvg,
                {
                    width:44,
                },
                {
                    width:72,
                    duration: 0.1
                }
            )
            gsap.fromTo(filterList,
                {
                    opacity: 0,
                    height: 100
                },
                {
                    opacity:1,
                    height: 130,
                    duration: 0.3
                }
            )
            
            filterSvg.classList.replace('rounded-full', 'rounded-b-lg');

        } else {
            setIsFilterClicked(false);

            gsap.fromTo(filterSvg,
                {
                    width: 67
                },
                {
                    width: 44,
                    duration: 0.3
                }

            )
            gsap.fromTo(filterList,
                {
                    opacity: 1,
                    height: 130,
                },
                {
                    opacity: 0,
                    height: 120,
                    duration: 0.15,
                }
            )

            filterSvg.classList.replace('rounded-b-lg', 'rounded-full');
            filterList.classList.add('pointer-events-none');
        }
    }   

    const makeDivForAccountItems = () => {
        if(!itemTypes) return;

        return (
            itemTypes.map((item, index) => (
                <div key={index} className='p-2 w-24 outline outline-1 outline-three m-1 rounded-md h-56 flex flex-col'>
                    <div className='w-fit mx-auto'>
                        {item.name.name}
                    </div>
                    <div className='mb-1'>
                        Level: {props.expToLvlConverter(item.exp)}
                    </div>
                    <div>
                        <div>
                            {item.substats[0].substatType.name}: {item.substats[0].value}
                        </div>
                        <div>
                            {item.substats[1].substatType.name}: {item.substats[1].value}
                        </div>
                        <div>
                            {item.substats[2].substatType.name}: {item.substats[2].value}
                        </div>
                    </div>
                    <div className='my-2 overflow-y-hidden'>
                        {item.character && item.characterId !== props.characterId ? 
                            <div className='lg:overflow-hidden'>
                                <div className='w-5 h-5 mx-auto bg-five rounded-full'>
                                    <svg className='w-4 h-4 mx-auto my-auto pt-0.5'>
                                        <image href='/charactericon.svg'></image>
                                    </svg>
                                </div>
                                <div className='w-fit mx-auto overflow-scroll lg:overflow-hidden lg:text-xs'>{item.character.characterName}</div>
                            </div>
                            :
                            <div>
                            </div>
                        }
                    </div>
                    <div className='mt-auto bg-three text-four rounded-lg text-center active:bg-two transition hover:bg-two'>
                        { _.isEqual(item, props.itemData) ? 
                            <button onClick={() => removeItemFromCharacterSubmit(item.id)}>
                                Remove
                            </button> 
                            : 
                            <button onClick={() => swapItemEquippedSubmit(props.username!, item.id, props.itemData?.id) }>
                                Equip
                            </button> 
                        }
                    </div>
                </div>
            ))
        )
    }

    return (
        <div className='flex justify-evenly flex-wrap overflow-scroll max-h-full'>
            {makeDivForAccountItems()}
            <div className='fixed bottom-3 right-[30px] h-11 w-11 ml-auto bg-transparent lg:right-1/4'>
                    <div className='z-50 max-h-11 ml-auto'>
                        <div id='filter-list' className='bg-three fixed bottom-[50px] right-0.5 text-four rounded-t-lg opacity-0 pointer-events-none lg:right-[23.5%]'>
                            <div className='p-2'>
                                <button onClick={() => handleSortButtonClick(sortingType === 'idAsc' || sortingType === 'default' ? 'idDes' : 'idAsc')}>
                                    {sortingType === 'idAsc' || sortingType === 'default' ? 'New' : 'Old'}
                                </button>
                            </div>
                            <div className='p-2'>
                                <button onClick={() => handleSortButtonClick('sortByHighestLevel')}>
                                    High Lvl
                                </button>                       
                            </div>
                            <div className='p-2'>
                                <button onClick={() => handleSortButtonClick('sortByLowestLevel')}>
                                    Low Lvl
                                </button>
                            </div> 
                        </div>
                    
                        <svg id='filter-svg' className='w-11 h-11 bg-three rounded-full pl-1.5 pt-1.5' onClick={handleFilterButtonPress}>
                            <image href='/filter.svg'></image>
                        </svg>
                    </div>
            </div>
        </div>
    )
}

export default SwapEquipForm