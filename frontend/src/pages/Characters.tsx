import { FormEvent, useEffect, useState } from 'react'
import { useUser } from '../middleware/UserContext'
import { useNavigate } from 'react-router-dom';
import * as CharacterApi from '../api/character';
import { CharacterData, CreateCharacterReq } from '../interface/characterType';

const Characters = () => {
    const [accountCharacters, setAccountCharacters] = useState<CharacterData[] | null>(null);
    const [isCreatingCharacter, setIsCreatingCharacter] = useState<boolean>(false);
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

    const allCharactersDiv = () => {
        if(!accountCharacters) return;
        return accountCharacters[0].characters.map((character, index) =>
            <div key={index}>
                <div onClick={() => navigateToCharacterPage(character.id)}>
                    {character.characterName}
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

        const characterCreateReq = await CharacterApi.createCharacter(userInfo.username, createCharacterForm);
        console.log(characterCreateReq);

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
            <div id='new-character-buttons' className='text-center'>
                <button onClick={() => setIsCreatingCharacter(true)}>
                    Create
                </button>
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