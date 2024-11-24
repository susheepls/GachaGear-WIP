import React, { SetStateAction, Dispatch, FormEvent } from 'react'
import { CreateCharacterReq, SearchedCharacters } from '../interface/characterType'
import * as CharacterApi from '../api/character'

interface Props {
    searchCharacterForm: CreateCharacterReq
    setSearchCharacterForm: Dispatch<SetStateAction<CreateCharacterReq>>
    setSearchedCharacterResult: Dispatch<SetStateAction<SearchedCharacters[] | string | null>>
}

const SearchRankings:React.FC<Props> = (props) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        props.setSearchCharacterForm(previousData => ({...previousData, [name]: value }));
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        if(props.searchCharacterForm.characterName.length < 3){
            props.setSearchedCharacterResult('None');
            return;
        }
        
        const result = await CharacterApi.searchCharacterByName(props.searchCharacterForm.characterName);

        if(!result) {
            props.setSearchedCharacterResult('None');
        } else {
            props.setSearchedCharacterResult(result);
        }

        //clear state after submission
        props.setSearchCharacterForm(previousData => ({...previousData, characterName:'' }));
    }

    return (
        <div className='mt-2 flex flex-col mx-auto'>
            <div>
                Search Character by Name
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input name='characterName' type='text' className='focus' placeholder='Character Name'
                    value={props.searchCharacterForm.characterName}
                    onChange={handleChange}
                    ></input>
                <div className='w-14 mx-auto rounded-xl outline outline-1 text-center m-2'>
                    <button type='submit'>Go</button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default SearchRankings