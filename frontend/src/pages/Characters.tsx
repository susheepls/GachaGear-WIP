import React, { useEffect } from 'react'
import { useUser } from '../middleware/UserContext'
import { useNavigate } from 'react-router-dom';

const Characters = () => {
    const { userInfo, fetchUserInfo } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if(!userInfo) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate]);

    return (
        <div>{userInfo ? `hello ${userInfo.username}` : 'loading..'}</div>
    )
}

export default Characters