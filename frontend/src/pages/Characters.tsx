import { FormEvent, useEffect, useState } from 'react'
import { useUser } from '../middleware/UserContext'
import { useNavigate } from 'react-router-dom';
import * as CharacterApi from '../api/character';
import { CharacterData, CreateCharacterReq } from '../interface/characterType';

const Characters = () => {
    const [accountCharacters, setAccountCharacters] = useState<CharacterData[] | null>(null);
    const [isCreatingCharacter, setIsCreatingCharacter] = useState<boolean>(false);
    const [isCharacterSelected, setIsCharacterSelected] = useState<number | null>(null);
    const [isDeletingChara, setIsDeletingChara] = useState<boolean>(false);
    const [toBeDeletedCharaId, setToBeDeletedCharaId] = useState<number | null>(null);
    const [createCharacterForm, setCreateCharacterForm] = useState<CreateCharacterReq>({ characterName: '' });

    const { userInfo, fetchUserInfo } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(!userInfo) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate]);

    useEffect(() => {
        fetchAccountCharacters();
    }, [userInfo, accountCharacters]);

    const fetchAccountCharacters = async() => {
        const substatOrder = ['atk', 'hp', 'def'];

        if(!userInfo) return;
        const accountCharacters = await CharacterApi.fetchAccountCharacters(userInfo.username);
        if(!accountCharacters) return;
        
        accountCharacters[0].characters.map((character) => character.equipment.forEach((item) => item.substats.sort((a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name))))
        setAccountCharacters(accountCharacters)
    };

    const navigateToCharacterPage = (characterId: number) => {
        if(!userInfo) return;
        navigate(`/${userInfo.username}/characters/${characterId}`);
    };

    //bring up the character delete confirm screen
    const aboutToDeleteCharacter = (characterId: number) => {
        setIsDeletingChara(true);
        setToBeDeletedCharaId(characterId);
    }

    //when no is pressed
    const cancelDeleteCharacter = () => {
        setIsDeletingChara(false);
        setToBeDeletedCharaId(null);
    }

    //when yes is pressed
    const confirmDeleteCharacter = async() => {
        if(!userInfo) return;
        if(!toBeDeletedCharaId) return;

        await CharacterApi.deleteCharacter(userInfo.username, toBeDeletedCharaId);
        
        setIsDeletingChara(false);
        setToBeDeletedCharaId(null);
    }

    const allCharactersDiv = () => {
        if(!accountCharacters) return;
        return accountCharacters[0].characters.map((character, index) =>
            <div key={index} className=''>
                <div className='relative'>
                    <div className='text-center bg-five w-fit mx-auto mt-2 text-four p-1 rounded-md' onClick={() => setIsCharacterSelected(character.id)}>
                        {character.characterName}
                    </div>
                    <div className='absolute right-1 top-2 text-one w-6 h-6 outline outline-1 outline-one rounded-lg'>
                        <button className='w-4 h-4' onClick={() => aboutToDeleteCharacter(character.id)}>
                            x
                        </button>
                    </div>
                </div>
                <div id={`character${character.id}-select-overlay`}>
                    {isCharacterSelected === character.id && (
                        <div className='absolute top-0 left-0 flex justify-center bg-pink-300 bg-opacity-70 z-50 w-full h-full'>
                            <div className='bg-white mt-28 mb-2 mx-2 rounded shadow-lg w-full h-1/2 flex flex-col'>
                                <div className='w-fit p-1 mt-2 font-medium mx-auto border-b-2 border-one'>
                                    {character.characterName}
                                </div>
                                <div id={`character${character.id}-equipment`} className='flex flex-col'>
                                    <div className='mt-2'>
                                        Gear List
                                    </div>
                                    {character.equipment.length >= 1 && (
                                        character.equipment.map((item, index) => (
                                            <div key={index} id={`character${character.id}-equipment${index}`} className='flex justify-center mt-1 outline outline-1 w-1/2 mx-auto mb-1 rounded-md'>
                                                <div className='w-20'>
                                                    {item.name.name}
                                                </div>
                                                <div>
                                                    {item.substats.map((substat, index) => (
                                                    <div key={index} id={`character${character.id}-equipment-substat${index}`} className='flex'>
                                                        <div>
                                                            {substat.substatType.name}:
                                                        </div>
                                                        <div className='ml-1'>
                                                            {substat.value}
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className='mt-5 w-fit p-1 mx-auto bg-three text-four rounded-md'>
                                    <button onClick={() => navigateToCharacterPage(character.id)}>Equip Gear</button>
                                </div>
                                <div className='mt-auto mb-1 w-fit p-1 px-2 mx-auto bg-five rounded-md text-four'>
                                    <button onClick={() => setIsCharacterSelected(null)}>Exit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> 
        )
    };

    //create character form
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setCreateCharacterForm(previousData => ({ ...previousData, [name]: value }));
    }
    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(!userInfo) return;

        if(createCharacterForm.characterName.length < 3) {
            const errorDiv = document.getElementById('error-message');
            if(!errorDiv) return;
            errorDiv.toggleAttribute('hidden');
            return;
        };

        const characterCreateReq = await CharacterApi.createCharacter(userInfo.username, createCharacterForm);
        if(!characterCreateReq) return;

        //clear state after submission
        setCreateCharacterForm(previousData => ({...previousData, characterName: '' }));
        setIsCreatingCharacter(false);
    }

    return (
        <div className='h-[calc(100vh-32px)] border border-two'>
            <div>{userInfo ? `` : 'loading..'}</div>
            <div className='flex flex-col text-center'>
                <div className='flex justify-center bg-three w-36 mx-auto rounded-md mt-1'>
                    <div className='font-semibold text-four'>
                        Character List
                    </div>
                    <div>
                        <svg className='h-4 w-4 bg-three rounded-md mt-1 ml-2'>
                            <image href='/charactericon.svg'></image>
                        </svg>
                    </div>
                </div>
                {accountCharacters && allCharactersDiv()}
            </div>
            <div id='new-character-buttons' className='mt-10 p-1 w-fit text-four bg-two rounded-lg mx-auto active:bg-three'>
                <button onClick={() => setIsCreatingCharacter(true)}>
                    Create
                </button>
            </div>

            {/* when user presses x to delete character */}
            <div id='delete-character-div'>
                {isDeletingChara && (
                <div className='absolute top-0 left-0 flex justify-center bg-five bg-opacity-50 z-50 w-full h-full'>
                    <div className='bg-four mt-28 mb-2 mx-2 rounded shadow-lg w-2/3 h-1/4 flex flex-col items-center outline-double outline-two'>
                        <div className='mt-6 w-fit mx-auto bg-two text-four p-2 rounded-lg'>
                            Confirm?
                        </div>
                        <div className='w-full flex mt-5'>
                            <div className='mx-auto w-fit p-2 bg-three text-four rounded-md active:bg-one'>
                                <button onClick={() => confirmDeleteCharacter()}>Yes</button>
                            </div>
                            <div className='mx-auto w-fit p-2 bg-five text-four rounded-md active:bg-one'>
                                <button onClick={() => cancelDeleteCharacter()}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            
            {/* div that shows when creating a character */}
            <div id='create-character-overlay'>
                {isCreatingCharacter && (
                    <div className='fixed flex justify-center left-0 top-0 w-full h-full bg-five z-50 bg-opacity-50'>
                        <div className='bg-white mt-28 mb-2 mx-2 rounded-md shadow-lg w-2/3 h-1/2 outline-double outline-two'>
                            <form className='flex flex-col justify-evenly align-middle h-5/6' onSubmit={handleSubmit}>
                                <div className='text-center text-four w-fit p-1 bg-three mx-auto rounded-md pb-3 px-2'>
                                    <label>
                                        New Character Name: <br/>
                                        <input className='outline outline-1 text-one mt-3' name='characterName' type='text' value={createCharacterForm.characterName} onChange={handleChange}/>
                                    </label>
                                </div>
                                <div className='w-fit p-1 mx-auto bg-three rounded-lg active:bg-two text-four'>
                                    <button type='submit'>Create!</button>
                                </div>
                                <div id='error-message' className='w-fit mx-auto p-1 bg-one text-four rounded-md' hidden>
                                    Character name too Short!
                                </div>
                            </form>
                            <div className='w-fit ml-2 bg-five text-one p-1 rounded-md'>
                                <button onClick={() => setIsCreatingCharacter(false)}>exit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Characters