import React, { useEffect, useState } from 'react'
import { Character } from '../interface/characterType';
import * as CharacterApi from '../api/character';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../middleware/UserContext';

const OneCharacter = () => {
    const [characterData, setCharacterData] = useState<Character | null>(null);

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
    }

    const expToLevelConverter = (exp: number) => {
        if (exp < 10) return 0;
        if (exp < 30) return 1;
        if (exp < 60) return 2;
        if (exp < 100) return 3;
        return 'MAX';
    };

    const characterDiv = () => {
        if(!characterData) return
        return (
            <div id='character-data'>
                <div id='character-name'>
                    {characterData.characterName}
                </div>
                {characterData.equipment.map((item, index) => 
                <div id='character-items' key={index}>
                    <div id={`${index}`}>
                        {item.name.name}
                    </div>
                    <div className='px-1'>
                        Level: {expToLevelConverter(item.exp)}
                    </div>
                    <div id={`substats${index}`}>
                        <div id='substat1'>
                            <div>
                                {item.substats[0].substatType.name}
                            </div>
                            <div>
                                {item.substats[0].value}
                            </div>
                        </div>
                        <div id='substat2'>
                            <div>
                                {item.substats[1].substatType.name}
                            </div>
                            <div>
                                {item.substats[1].value}
                            </div>
                        </div>
                        <div id='substat3'>
                            <div>
                                {item.substats[2].substatType.name}
                            </div>
                            <div>
                                {item.substats[2].value}
                            </div>
                        </div>
                    </div> 
                </div>
                )}
            </div>
        )
    }
    return (
        <div>
            {characterDiv()}
        </div>
    )
}

export default OneCharacter