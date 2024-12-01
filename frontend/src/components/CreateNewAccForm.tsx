import React, { FormEvent, SetStateAction, useState } from 'react'
import { AccountCreateMessage, AccountLoginType } from '../interface/accountTypes'
import { createAccRequest } from '../api/createAcc';

interface Props {
    setLoginMessage: React.Dispatch<SetStateAction<string | null>>,
    setIsCreatingAcc: React.Dispatch<SetStateAction<boolean>>
}

const CreateNewAccForm: React.FC<Props> = (props) => {

    const [formData, setFormData] = useState<AccountLoginType>({ username: '', password: '' });

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        if(formData.username.length < 3 || formData.password.length < 8) {
            alert('username must be longer than 3 characters and password must be longer than 8 characters');
            return;
        }
        const result = await createAccRequest(formData);
        const message: AccountCreateMessage = await result?.json();
        props.setIsCreatingAcc(false);
        props.setLoginMessage(message.message);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData( previousData => (
            {...previousData, [name]: value}
        ));
    };

    const backButton = () => {
        setFormData({ username: '', password: '' });
        props.setIsCreatingAcc(false);
    }

    return (
        <div className='flex flex-col'>
            <form className='flex flex-col mt-3' onSubmit={handleSubmit}>
                <div className='flex w-2/3 mx-auto'>
                    <label className='p-1'>
                        User:
                        <input className='focus:outline focus:outline-1 ml-1' name='username' type='text' value={formData.username} onChange={handleChange} required/>
                    </label> 
                </div>
                <div className='flex w-2/3 mx-auto'>
                    <label className='p-1'>
                        Pass:
                        <input className='focus:outline focus:outline-1 ml-1' name='password' type='password' value={formData.password} onChange={handleChange} required/>
                    </label>
                </div>
                <div className='mx-auto mb-2 text-center outline outline-1 rounded-md w-32 bg-three text-four'>
                    <button type='submit'>Create Account!</button>
                </div>
            </form>
            <svg className='h-8 w-8 bg-three rounded-full mx-auto'>
                <image onClick={backButton} href='back-button.svg'></image>
            </svg>
        </div>
    )
}

export default CreateNewAccForm