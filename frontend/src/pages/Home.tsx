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

    const toRankingPage = () => {
        navigate('/rankings');
    }

    const toCharacters = () => {
        navigate('/characters')
    }

    return (
        <div>
            {!token ? (
                <div className='flex flex-col'>
                    <div>
                        <div className='text-center w-40 mx-auto bg-three text-four rounded-md my-2 active:bg-two'>
                            <button onClick={() => toLoginPage()}>Click Here to Login!</button>
                        </div>
                    </div>
                    <div className='flex h-5 mx-auto mt-3'>
                        <div>
                            <button onClick={() => toRankingPage()}>View Rankings</button>
                        </div>
                        <svg className='w-4 h-4 my-auto ml-1 mt-1.5'>
                            <image href='trophy.svg'></image>
                        </svg>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col'>
                    <div className='text-center drop-shadow-[0_1.2px_1.2px_rgba(191,297,176,0.8)] text-three text-lg'>
                        Welcome back {userInfo ? userInfo.username : ''}
                    </div>
                    <div className='flex h-9 ml-10'>
                        <div className='mt-1'>
                            <button onClick={() => toAccountInventory()}>Check Inventory</button>
                        </div>
                        <svg className='w-4 h-4 my-auto ml-1'>
                            <image href='/bag-shopping.svg'></image>
                        </svg>
                    </div>
                    <div className='flex h-5 ml-10'>
                        <div className=''>
                            <button onClick={() => toGachaRoll()}>Get Gear</button>
                        </div>
                        <svg className='w-4 h-4 my-auto ml-1 mt-2'>
                            <image href='/sword.svg'></image>
                        </svg>
                    </div>
                    <div className='flex h-5 ml-10 mt-2'>
                        <div className=''>
                            <button onClick={() => toCharacters()}>My Characters</button>
                        </div>
                        <svg className='w-4 h-4 my-auto ml-1 mt-1.5'>
                            <image href='/mycharacters.svg'></image>
                        </svg>
                    </div>
                    <div className='flex h-5 ml-10 mt-3'>
                        <div>
                            <button onClick={() => toRankingPage()}>Rankings</button>
                        </div>
                        <svg className='w-4 h-4 my-auto ml-1 mt-1.5'>
                            <image href='/trophy.svg'></image>
                        </svg>
                    </div>
                    <div className='mt-2'>
                        <div className='text-center w-16 mx-auto bg-three text-four rounded-md my-2'>
                            <button onClick={() => logout()}>Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home