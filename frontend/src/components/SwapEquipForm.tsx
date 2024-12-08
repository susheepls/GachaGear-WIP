import React, { SetStateAction, useEffect, useState } from 'react'
import { Item } from '../interface/inventoryType'
import * as InventoryApi from '../api/inventory'
import _ from 'lodash';
import * as CharacterApi from '../api/character'

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
                            <div>
                                <div className='w-5 h-5 mx-auto bg-five rounded-full'>
                                    <svg className='w-4 h-4 mx-auto my-auto pt-0.5'>
                                        <image href='/charactericon.svg'></image>
                                    </svg>
                                </div>
                                <div className='w-fit mx-auto overflow-scroll'>{item.character.characterName}</div>
                            </div>
                            :
                            <div>
                            </div>
                        }
                    </div>
                    <div className='mt-auto bg-three text-four rounded-lg text-center active:bg-two'>
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
        </div>
    )
}

export default SwapEquipForm