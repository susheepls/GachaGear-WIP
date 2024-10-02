// import React from 'react'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    const infoFromLogin = useLocation();

    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if(infoFromLogin.state?.username){
            setUsername(infoFromLogin.state.username);
        }
    }, [infoFromLogin.state]);
    
    const toLoginPage = () => {
        navigate('/login')
    };

    const logout = () => {
        setUsername(null);
        localStorage.removeItem('authToken');
        navigate('/');
    }

    return (
        <div>
            {!username ? (
                <div>
                    <button onClick={() => toLoginPage()}>Click Here to Login!</button>
                </div>
            ) : (
                <>
                    <div>
                        Welcome back {username}
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