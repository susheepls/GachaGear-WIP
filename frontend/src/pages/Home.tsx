// import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useUser } from '../middleware/UserContext';

const Home = () => {
    const navigate = useNavigate();
   
    const token = Cookies.get('token');

    const { userInfo, fetchUserInfo } = useUser();

    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate, token]);

    const toLoginPage = () => {
        navigate('/login');
    };

    const logout = () => {
        Cookies.remove('token');
        navigate('/');
    }

    const toAccountInventory = () => {
        navigate(`${userInfo?.username}/inventory`, { state: { username : userInfo?.username} });
    }

    const toGachaRoll = () => {
        navigate('/gacharoll');
    }

    return (
        <div>
            {!token ? (
                <div className='flex'>
                    <div className='p-1 m-auto'>
                        <button onClick={() => toLoginPage()}>Click Here to Login!</button>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        Welcome back {userInfo ? userInfo.username : ''}
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