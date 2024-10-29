import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AccountInfoType } from '../interface/accountTypes';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getAccountFromToken } from '../api/login';
import * as BoxApi from '../api/boxTime';

const CurrencyBox = () => {
    const [lastFreeBoxTime, setLastFreeBoxTime] = useState<Date | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfoFromToken(navigate);
    }, [token]);

    useEffect(() => {
        fetchLastFreeBoxTime();
    }, [username]);

    const getUserInfoFromToken = async(navigate: NavigateFunction) => {
        const userInfo: AccountInfoType | null = await getAccountFromToken(navigate);

        if(!userInfo) return;
        setUsername(userInfo.username);
    };

    const fetchLastFreeBoxTime = async() => {
        if(!username) return;
        const lastFreeBoxDate = await BoxApi.getLastOpenedDate(username);

        if(!lastFreeBoxDate) return;
        if(lastFreeBoxDate.last_box_open === null){
            setLastFreeBoxTime(null);
        } else {
            const date = new Date(lastFreeBoxDate.last_box_open);
            setLastFreeBoxTime(date);
        }
    };

    const updateLastFreeBoxTime = async() => {
        if(!username) return;
        const updateLastOpenTime = await BoxApi.updateLastOpenedDate(username);
        if(!updateLastOpenTime){
            alert('Error');
        } else {
            const newTime = new Date(updateLastOpenTime)
            setLastFreeBoxTime(newTime);
        }
    }

    const checkIfCanOpen = () => {
        const date = new Date();
        if(lastFreeBoxTime && (date - lastFreeBoxTime)/60000 >= 1){
            updateLastFreeBoxTime();
            console.log('success');
        } else {
            console.log((date - lastFreeBoxTime)/60000)
            console.log('not yet')
        }
    }


    return (
        <div>
           <div>
                <button onClick={() => checkIfCanOpen()}>Daily Free Currency!</button>
           </div>
        </div>
    )
}

export default CurrencyBox