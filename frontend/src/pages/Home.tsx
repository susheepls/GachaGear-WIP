// import React from 'react'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const Home = () => {
    const navigate = useNavigate();
    const infoFromLogin = useLocation();
    const token = Cookies.get('token');

    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if(infoFromLogin.state?.username){
            setUsername(infoFromLogin.state.username);
        }
    }, [infoFromLogin.state]);
    
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

    return (
        <div>
            {!token ? (
                <>
                    <div>
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
                        <button onClick={() => logout()}>Log Out</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home