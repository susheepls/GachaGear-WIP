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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='p-1'>
                        Username:
                        <input name='username' type='text' value={formData.username} onChange={handleChange} required/>
                    </label> 
                </div>
                <div>
                    <label className='p-1'>
                        Password:
                        <input name='password' type='password' value={formData.password} onChange={handleChange} required/>
                    </label>
                </div>
                <div className='text-center'>
                    <button type='submit'>Create Account!</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewAccForm