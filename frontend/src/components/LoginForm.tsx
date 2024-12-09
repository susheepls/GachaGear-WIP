import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { AccountLoginMessageType, AccountLoginType } from '../interface/accountTypes';
import * as loginApi from '../api/login';
import Cookies from 'js-cookie';

interface Props {
    setLoginMessage: Dispatch<SetStateAction<string | null>>
    setUsername: Dispatch<SetStateAction<string | null>>
}

const LoginForm: React.FC<Props> = (props) => {
    //useStates
    const [formData, setFormData] = useState<AccountLoginType>({username : '', password: ''})

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
       
        const result = await loginApi.loginFetch(formData);
        const loginMessage: AccountLoginMessageType = await result?.json();
        props.setLoginMessage(loginMessage.message);
        
        //if login is successful, set cookies
        if(loginMessage.accessToken) {
            Cookies.set('token', loginMessage.accessToken, { secure: true, sameSite: 'strict'} );
            props.setUsername(formData.username);
        }

        //clear state after submission
        setFormData(previousData => ({...previousData, username: '', password: ''}))
    }

    //setting the useState which is the form data obj. for setstate on objects format is (old => (new)) so {...old, [newdataKeyname] : newdatavalue}
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(previousData => ({...previousData, [name]: value}));
    }

    return (
        <div>
            <form className='flex flex-col mt-3' onSubmit={handleSubmit}>
                <div className='flex w-2/3 mx-auto'>   
                    <label className='p-1'>
                        User: 
                        <input className='focus:outline focus:outline-1 outline outline-1 outline-three text-opacity-100 rounded-md ml-1 lowercase' name='username' type='text' value={formData.username} onChange={handleChange} required/>
                    </label> 
                </div>
                <div className='flex w-2/3 mx-auto'>
                    <label className='p-1'>
                        Pass:
                        <input className='focus:outline focus:outline-1 ml-1 outline outline-1 outline-three text-opacity-100 rounded-md' name='password' type='password' value={formData.password} onChange={handleChange} required/>
                    </label>
                </div>
                <div className='mx-auto mb-2 text-center outline outline-1 rounded-md w-16 bg-three text-four active:bg-two'>
                    <button className='p-1' type='submit'>Log In</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm