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
        if(!userInfo) return;
        const accountCharacters = await CharacterApi.fetchAccountCharacters(userInfo.username);
        if(!accountCharacters) return;
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

        const deleteCharacterReq = await CharacterApi.deleteCharacter(userInfo.username, toBeDeletedCharaId);
        console.log(deleteCharacterReq);
        setIsDeletingChara(false);
        setToBeDeletedCharaId(null);
    }

    const allCharactersDiv = () => {
        if(!accountCharacters) return;
        return accountCharacters[0].characters.map((character, index) =>
            <div key={index} className=''>
                <div className='relative'>
                    <div className='text-center' onClick={() => setIsCharacterSelected(character.id)}>
                        {character.characterName}
                    </div>
                    <div className='absolute right-3 top-0'>
                        <button onClick={() => aboutToDeleteCharacter(character.id)}>x</button>
                    </div>
                </div>
                <div id={`character${character.id}-select-overlay`}>
                    {isCharacterSelected === character.id && (
                        <div className='absolute top-0 left-0 flex justify-center bg-blue-500 bg-opacity-70 z-50 w-full h-full'>
                            <div className='bg-white mt-28 mb-2 mx-2 rounded shadow-lg w-full h-1/2 flex flex-col'>
                                <div>
                                    {character.characterName}
                                </div>
                                <div id={`character${character.id}-equipment`} className='flex flex-col'>
                                    {character.equipment.length >= 1 && (
                                        character.equipment.map((item, index) => (
                                            <div key={index} id={`character${character.id}-equipment${index}`} className='flex justify-center pt-5'>
                                                <div className='w-20'>
                                                    {item.name.name}
                                                </div>
                                                <div>
                                                    {item.substats.map((substat, index) => (
                                                    <div key={index} id={`character${character.id}-equipment-substat${index}`} className='flex'>
                                                        <div>
                                                            {substat.substatType.name}:
                                                        </div>
                                                        <div>
                                                            {substat.value}
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className='pt-5'>
                                    <button onClick={() => navigateToCharacterPage(character.id)}>Equip Gear</button>
                                </div>
                                <div className='mt-auto'>
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
        <div>
            <div>{userInfo ? `` : 'loading..'}</div>
            <div className='flex flex-col text-center'>
                {accountCharacters && allCharactersDiv()}
            </div>
            <div id='new-character-buttons' className='text-center pt-10'>
                <button onClick={() => setIsCreatingCharacter(true)}>
                    Create
                </button>
            </div>

            {/* when user presses x to delete character */}
            <div id='delete-character-div'>
                {isDeletingChara && (
                <div className='absolute top-0 left-0 flex justify-center bg-blue-500 bg-opacity-70 z-50 w-full h-full'>
                    <div className='bg-white mt-28 mb-2 mx-2 rounded shadow-lg w-full h-1/4 flex flex-col items-center'>
                        <div className='pt-6'>
                            Confirm?
                        </div>
                        <div className='w-full flex mt-5'>
                            <div className='mx-auto'>
                                <button onClick={() => confirmDeleteCharacter()}>Yes</button>
                            </div>
                            <div className='mx-auto'>
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
                    <div className='fixed flex justify-center left-0 top-0 w-full h-full bg-blue-500 z-50 bg-opacity-70'>
                        <div className='bg-white mt-28 mb-2 mx-2 rounded shadow-lg w-full h-1/2'>
                            <form className='flex flex-col justify-evenly align-middle h-5/6' onSubmit={handleSubmit}>
                                <div className='text-center'>
                                    <label>
                                        New Character Name: <br/>
                                        <input className='outline' name='characterName' type='text' value={createCharacterForm.characterName} onChange={handleChange}/>
                                    </label>
                                </div>
                                <div className='text-center'>
                                    <button type='submit'>Create!</button>
                                </div>
                                <div id='error-message' className='text-center' hidden>
                                    Character name too Short!
                                </div>
                            </form>
                            <div>
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