import React, { useEffect, useState } from 'react'
import { Character } from '../interface/characterType';
import * as CharacterApi from '../api/character';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../middleware/UserContext';
import { Item } from '../interface/inventoryType';

const OneCharacter = () => {
    const [characterData, setCharacterData] = useState<Character | null>(null);
    const [characterItems, setCharacterItems] = useState<Item[] | null>(null);
    const { userInfo, fetchUserInfo } = useUser();
    const navigate = useNavigate();

    //character id from url params
    const { id } = useParams()

    useEffect(() => {
        if(!userInfo) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate]);

    useEffect(() => {
        fetchCharacterData();
    }, [userInfo, characterData]);

    const fetchCharacterData = async() => {
        if(!userInfo || !id) return;
        const character = await CharacterApi.fetchOneCharacter(userInfo.username, id);
        if(!character) return;
        setCharacterData(character);

        //sort the order of equipment for character
        const itemTypeOrder = ['hat', 'armor', 'sword'];
        const characterItems = character.equipment;
        if(!characterItems) return;
        characterItems.sort((a,b) => itemTypeOrder.indexOf(a.name.name) - itemTypeOrder.indexOf(b.name.name));
        setCharacterItems(characterItems);
    }

    const expToLevelConverter = (exp: number) => {
        if (exp < 10) return 0;
        if (exp < 30) return 1;
        if (exp < 60) return 2;
        if (exp < 100) return 3;
        return 'MAX';
    };

    const totalSubstatCalculator = (characterItems: Item[], substatType: string) => {
        let substatTotal = 0;
        characterItems.forEach((item) => 
            item.substats.forEach((substat) => {
                if(substat.substatType.name === substatType) {
                    substatTotal += substat.value;
                }
            })
        )
        return substatTotal;
    };

    const itemStatDivMaker = (item: Item) => {
        if(!item) return;
        return (
            <div id={`${item.name.name}-info`} key={item.id} className='flex-col w-36'>
                <div className='text-center'>
                    Level {expToLevelConverter(item.exp)}
                </div>
                <div id='substats' className='flex justify-center'>
                    <div id='substat 1'>
                        <div className='p-1'>
                            {item.substats[0].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[0].value}
                        </div>
                    </div>
                    <div id='substat 2'>
                        <div className='p-1'>
                            {item.substats[1].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[1].value}
                        </div>
                    </div>
                    <div id='substat 3'>
                        <div className='p-1'>
                            {item.substats[2].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[2].value}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='text-center'>
                {characterData?.characterName}
            </div>
            <div id='hat' className='flex justify-between'>
                <div>
                    Hat
                </div>
                {characterItems && itemStatDivMaker(characterItems[0])}
                <div>
                    <button>Equip</button>
                </div>
            </div>
            <div id='armor' className='flex justify-between'>
                <div>
                    Armor
                </div>
                {characterItems && itemStatDivMaker(characterItems[1])}
                <div>
                    <button>Equip</button>
                </div>
            </div>
            <div id='sword'className='flex justify-between'>
                <div>
                    Sword
                </div>
                {characterItems && itemStatDivMaker(characterItems[2])}
                <div>
                    <button>Equip</button>
                </div>
            </div>
            <div id='character-totals'>
                <div>
                    Total atk {characterItems ? totalSubstatCalculator(characterItems, 'atk') : 0}
                </div>
                <div>
                    Total def {characterItems ? totalSubstatCalculator(characterItems, 'def') : 0}
                </div>
                <div>
                    Total hp {characterItems ? totalSubstatCalculator(characterItems, 'hp') : 0}
                </div>
            </div>
        </div>
    )
}

export default OneCharacter