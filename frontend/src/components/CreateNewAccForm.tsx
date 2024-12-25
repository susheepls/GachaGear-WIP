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
            <form className='flex flex-col mt-10' onSubmit={handleSubmit}>
                <div className='flex mx-auto'>
                    <label className='absolute left-[10%] lg:left-[40%] lg:font-bold'>
                        User:
                    </label> 
                    <input className='focus:outline focus:outline-1 outline outline-1 outline-three text-opacity-100 rounded-md ml-1 lowercase' name='username' type='text' value={formData.username} onChange={handleChange} required/>
                </div>
                <div className='flex mx-auto mt-3'>
                    <label className='absolute left-[10%] lg:left-[40%] lg:font-bold'>
                        Pass:
                    </label>
                    <input className='focus:outline focus:outline-1 ml-1 outline outline-1 outline-three text-opacity-100 rounded-md' name='password' type='password' value={formData.password} onChange={handleChange} required/>
                </div>
                <div className='mx-auto mb-2 mt-11 text-center outline outline-1 rounded-md w-32 bg-three text-four transition hover:bg-two hover:scale-110 duration-300'>
                    <button type='submit'>Create Account!</button>
                </div>
            </form>
            <svg className='h-8 w-8 bg-three rounded-full mx-auto transition hover:scale-110'>
                <image onClick={backButton} href='back-button.svg'></image>
            </svg>
        </div>
    )
}

export default CreateNewAccForm