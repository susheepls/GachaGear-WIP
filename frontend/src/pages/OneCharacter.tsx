import { useEffect, useState } from 'react'
import { Character } from '../interface/characterType';
import * as CharacterApi from '../api/character';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../middleware/UserContext';
import { Item } from '../interface/inventoryType';
import SwapEquipForm from '../components/SwapEquipForm';

const OneCharacter = () => {
    const [characterData, setCharacterData] = useState<Character | null>(null);
    const [characterItems, setCharacterItems] = useState<(Item | null)[]>([null, null, null]);
    const [activeForm, setActiveForm] = useState<string | null>(null);

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
        const orderedItems: (Item|null)[] = [null, null, null];

        const characterItems = character.equipment;
        if(!characterItems) return;
        characterItems.forEach((item) => {
            const index = itemTypeOrder.indexOf(item.name.name);
            if (index !== -1) {
                orderedItems[index] = item;
            }
        });
        setCharacterItems(orderedItems);
    }

    const expToLevelConverter = (exp: number) => {
        if (exp < 10) return 0;
        if (exp < 30) return 1;
        if (exp < 60) return 2;
        if (exp < 100) return 3;
        return 'MAX';
    };

    const totalSubstatCalculator = (characterItems: (Item|null)[] , substatType: string) => {
        let substatTotal = 0;

        characterItems.forEach((item) => {
            if(item) {
                item.substats.forEach((substat) => {
                    if(substat.substatType.name === substatType) {
                        substatTotal += substat.value;
                    }
                })
            } 
        })
        return substatTotal;
    };

    const toggleForm = (itemType: string) => {
        setActiveForm((prev) => (prev === itemType ? null : itemType));
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
        <div className='flex flex-col py-3 h-screen'>
            <div className='text-center'>
                {characterData?.characterName}
            </div>
            {["hat", "armor", "sword"].map((itemType, index) => (
                <div key={itemType} className="flex flex-col relative">
                    <div id={itemType} className="flex justify-between">
                        <div>
                            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                        </div>
                        {characterItems && characterItems[index] ?
                            itemStatDivMaker(characterItems[index])
                            :
                            <div>
                                <button onClick={() => toggleForm(itemType)}>Equip</button>
                            </div>
                        }
                        {characterItems && characterItems[index] && (
                            <div>
                                <button onClick={() => toggleForm(itemType)}>Swap</button>
                            </div>
                        )}
                    </div>
                    {activeForm === itemType && ( 
                        <div className='absolute inset-0 inset-y-28 flex items-center justify-center z-50 bg-black bg-opacity-50'>
                            <div className='bg-white p-6 rounded shadow-lg'>
                                <SwapEquipForm 
                                    username={userInfo && userInfo.username } 
                                    itemType={itemType} 
                                    itemData={characterItems[index]}
                                    characterId={id ? Number(id) : null}
                                />
                                <div>
                                    <button onClick={() => toggleForm(itemType)}>Exit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
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