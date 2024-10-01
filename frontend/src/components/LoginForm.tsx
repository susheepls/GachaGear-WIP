import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AccountLoginMessageType, AccountLoginType } from '../interface/accountTypes';
import * as loginApi from '../api/login'

interface Props {
    setLoginMessage: Dispatch<SetStateAction<string | null>>
}

const LoginForm: React.FC<Props> = (props) => {
    //useStates
    const [formData, setFormData] = useState<AccountLoginType>({username : '', password: ''})

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
       
        const result = await loginApi.loginFetch(formData);
        const loginMessage: AccountLoginMessageType = await result?.json();
        props.setLoginMessage(loginMessage.message)

        //clear state after submission
        setFormData(previousData => ({...previousData, username: '', password: ''}))
    }

    //setting the useState which is the form data obj. for setstate on objects format is (old => (new)) so {...old, [newdata] : newdatavalue}
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(previousData => ({...previousData, [name]: value}));
    }

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

export default LoginForm