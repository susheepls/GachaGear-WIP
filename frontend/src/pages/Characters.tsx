import { useEffect, useState } from 'react'
import { useUser } from '../middleware/UserContext'
import { useNavigate } from 'react-router-dom';
import * as CharacterApi from '../api/character';
import { CharacterData } from '../interface/characterType';

const Characters = () => {
    const [accountCharacters, setAccountCharacters] = useState<CharacterData[] | null>(null);

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
    }

    return (
        <div>
            <div>{userInfo ? `` : 'loading..'}</div>
            <div>
                {accountCharacters && allCharactersDiv()}
            </div>
        </div>
    )
}

export default Characters