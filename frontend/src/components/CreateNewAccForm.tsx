import React, { FormEvent, useState } from 'react'
import { AccountLoginType } from '../interface/accountTypes'
import { createAccRequest } from '../api/createAcc';

const CreateNewAccForm = () => {

    const [formData, setFormData] = useState<AccountLoginType>({ username: '', password: '' });

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        if(formData.username.length < 3 || formData.password.length < 8) {
            alert('username must be longer than 3 characters and password must be longer than 8 characters');
            return;
        }
        const request = await createAccRequest(formData);
        console.log(request);
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
                <label>
                    Username:
                    <input name='username' type='text' value={formData.username} onChange={handleChange} required/>
                </label> 
                <br/>
                <label>
                    Password:
                    <input name='password' type='password' value={formData.password} onChange={handleChange} required/>
                </label>
                <br/>
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default CreateNewAccForm