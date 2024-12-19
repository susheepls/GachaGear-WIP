import { useEffect, useState } from 'react'
import { Character, Skins } from '../interface/characterType';
import * as CharacterApi from '../api/character';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../middleware/UserContext';
import { Item } from '../interface/inventoryType';
import SwapEquipForm from '../components/SwapEquipForm';
import CharacterSkinSwap from '../components/CharacterSkinSwap';

const OneCharacter = () => {
    const [characterData, setCharacterData] = useState<Character | null>(null);
    const [characterItems, setCharacterItems] = useState<(Item | null)[]>([null, null, null]);
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const [updatedItem, setUpdatedItem] = useState<boolean>(false);
    const [characterSkins, setCharacterSkins] = useState<(Skins | null)[]>([null, null, null]);
    const [isChangingSkins, setIsChangingSkins] = useState<boolean>(false);

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
    }, [userInfo, activeForm, updatedItem]);

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
        
        //sort the substats of each equipment
        const substatOrder = ['atk', 'hp', 'def'];
        characterItems.forEach((item) => {
            item.substats.sort((a,b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
        });

        characterItems.forEach((item) => {
            const index = itemTypeOrder.indexOf(item.name.name);
            if (index !== -1) {
                orderedItems[index] = item;
            }
        });

        //sort the skins and put them in order of [hat, armor, sword];
        const orderedSkins: (Skins | null)[] = [null, null, null];
        const characterSkins = character.skins;
        characterSkins.forEach((skin) => {
            const index = itemTypeOrder.indexOf(skin.itemName.name);
            if(index !== -1) {
                orderedSkins[index] = skin;
            }
        });

        setCharacterItems(orderedItems);
        setCharacterSkins(orderedSkins);
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

    const toEnhancePage = (itemId: number) => {
        navigate(`/${userInfo?.username}/inventory/${itemId}`);
    };

    const handleSkinsSource = (skinArrayIndex: number) => {
        const defaultSkins = ['/charactersprites/defaulthat.png', '/charactersprites/defaultarmor.png', '/charactersprites/defaultsword.png'];
        const skin = characterSkins[skinArrayIndex];

        if(!skin) return defaultSkins[skinArrayIndex];
        if(skin && skin.rarity.name !== 'epic') {
            return `/skins/${skin.name}${skin.itemName.name}.png`;
        } else {
            return `/skins/${skin.name}${skin.itemName.name}.gif`;
        }
    }

    const itemStatDivMaker = (item: Item) => {
        if(!item) return;
        return (
            <div id={`${item.name.name}-info`} key={item.id} className='flex-col w-36 h-fit outline outline-1 rounded-md outline-two my-2'>
                <div className='text-center'>
                    Level {expToLevelConverter(item.exp)}
                </div>
                <div id='substats' className='flex justify-center'>
                    <div id='substat 1' className='mx-1'>
                        <div className='p-1'>
                            {item.substats[0].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[0].value}
                        </div>
                    </div>
                    <div id='substat 2' className='mx-1'>
                        <div className='p-1'>
                            {item.substats[1].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[1].value}
                        </div>
                    </div>
                    <div id='substat 3' className='mx-1'>
                        <div className='p-1'>
                            {item.substats[2].substatType.name}
                        </div>
                        <div className='p-1'>
                            {item.substats[2].value}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='w-fit p-0.5 bg-two text-four rounded-md mx-auto mb-1' onClick={() => toEnhancePage(item.id)}>
                        Enhance
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col py-3 h-full bg-four'>
            <div className='w-fit mx-auto p-1 rounded-sm border-b-2 border-b-one font-bold'>
                {characterData?.characterName}
            </div>
            {isChangingSkins &&
                <CharacterSkinSwap
                accountId = {userInfo!.id}
                username = {userInfo!.username}
                characterId = {characterData!.id}
                characterSkins = {characterSkins}
                />
            }
            <div id='character-picture' className='relative h-fit overflow-hidden'>
                <div className='w-full p-2'>
                    <img className='mx-auto' onClick={() => setIsChangingSkins(true)} src='/charactersprites/character.png'></img>
                    <img className='h-fit absolute top-3 left-1/2 transform -translate-x-1/3' src={handleSkinsSource(0)}></img>
                    <img className='h-fit absolute top-1/2 left-1/2 transform -translate-x-[47%] translate-y-[12%]' src={handleSkinsSource(1)}></img>
                    <img className='h-fit w-fit absolute top-1/2 left-[31%] transform -translate-x-1/3 lg:left-1/2 lg:-translate-x-24' src={handleSkinsSource(2)}></img>
                </div>
            </div>
            {["hat", "armor", "sword"].map((itemType, index) => (
                <div key={itemType} className="flex flex-col">
                    <div id={itemType} className="flex justify-between h-fit">
                        <div className='w-12 my-auto'>
                            <div className='w-fit mx-auto'>
                                {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                            </div>
                            <div className='w-fit h-fit mx-auto'>
                                <svg className='w-4 h-4'>
                                    <image href={'/' + itemType + '.svg'}></image>
                                </svg>
                            </div>
                        </div>
                        {characterItems && characterItems[index] ?
                            itemStatDivMaker(characterItems[index])
                            :
                            <div className='my-auto w-fit bg-three p-1 text-four rounded-lg active:bg-two'>
                                <button onClick={() => toggleForm(itemType)}>Equip</button>
                            </div>
                        }
                        {characterItems && characterItems[index] && (
                            <div className='my-auto w-fit bg-three p-1 text-four rounded-lg active:bg-two'>
                                <button onClick={() => toggleForm(itemType)}>Swap</button>
                            </div>
                        )}
                    {activeForm === itemType && ( 
                        <div className='fixed top-0 left-0 flex justify-center z-50 bg-five bg-opacity-50 w-full max-h-full h-full'>
                            <div className='bg-white p-6 mt-2 mb-2 mx-2 rounded shadow-lg w-full'>
                                <SwapEquipForm 
                                    username={userInfo && userInfo.username } 
                                    itemType={itemType} 
                                    itemData={characterItems[index]}
                                    characterId={id ? Number(id) : null}
                                    expToLvlConverter={expToLevelConverter}
                                    setUpdatedItem={setUpdatedItem}
                                    updatedItem={updatedItem}
                                />
                                <div className='fixed bottom-2 left-3 w-7 rounded-md bg-five text-four p-0.5'>
                                    <button onClick={() => toggleForm(itemType)}>Exit</button>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            ))}
            <div id='character-totals' className='flex flex-col outline outline-1 outline-three mx-1'>
                <div className='w-fit p-1 mx-auto bg-one text-white mt-3 rounded-md mb-3'>
                    Total Stats
                </div>
                <div className='flex flex-col'>
                    <div className='mb-2'>
                        <div className='w-36 p-1 mx-auto text-center'>
                            Total atk: {characterItems ? totalSubstatCalculator(characterItems, 'atk') : 0}
                        </div>
                        <div className='w-fit h-fit mx-auto'>
                            <svg className='w-5 h-5'>
                                <image href='/highestatk.svg'></image>
                            </svg>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <div className='w-36 p-1 mx-auto text-center'>
                            Total hp: {characterItems ? totalSubstatCalculator(characterItems, 'hp') : 0}
                        </div>
                        <div className='w-fit h-fit mx-auto'>
                            <svg className='w-5 h-5'>
                                <image href='/highesthp.svg'></image>
                            </svg>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <div className='w-36 p-1 mx-auto text-center'>
                            Total def: {characterItems ? totalSubstatCalculator(characterItems, 'def') : 0}
                        </div>
                        <div className='w-fit h-fit mx-auto'>
                            <svg className='w-5 h-5'>
                                <image href='/highestdef.svg'></image>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OneCharacter