// import React from 'react'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import * as LoginApi from '../api/login';
import { AccountInfoType } from '../interface/accountTypes';

const Home = () => {
    const navigate = useNavigate();
    const infoFromLogin = useLocation();
    const token = Cookies.get('token');

    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if(token){
            getAccountUsernameFromToken();
        };
    }, [token, infoFromLogin.state]);
    
    const getAccountUsernameFromToken = async() => {
        const userInfo: AccountInfoType | null = await LoginApi.getAccountFromToken(navigate);
        if(userInfo) setUsername(userInfo.username);
    }

    const toLoginPage = () => {
        navigate('/login');
    };

    const logout = () => {
        setUsername(null);
        Cookies.remove('token');
        navigate('/');
    }

    const toAccountInventory = () => {
        navigate(`${username}/inventory`, { state: { username : username} });
    }

    const toGachaRoll = () => {
        navigate('/gacharoll');
    }

    return (
        <div>
            {!token ? (
                <>
                    <div className='p-1'>
                        <button onClick={() => toLoginPage()}>Click Here to Login!</button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        Welcome back {username}
                    </div>
                    <div>
                        <button onClick={() => toAccountInventory()}>Check Inventory</button>
                    </div>
                    <div>
                        <button onClick={() => toGachaRoll()}>want to gamba?</button>
                    </div>
                    <div>
                        <button onClick={() => logout()}>Log Out</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home