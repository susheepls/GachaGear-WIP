import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AccountInfoType } from '../interface/accountTypes';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getAccountFromToken } from '../api/login';
import * as BoxApi from '../api/boxTime';
import Timer from '../components/Timer';

const CurrencyBox = () => {
    const [lastFreeBoxTime, setLastFreeBoxTime] = useState<Date | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [timerComplete, setTimerComplete] = useState<boolean>(false);

    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfoFromToken(navigate);
    }, [token]);

    useEffect(() => {
        fetchLastFreeBoxTime();
    }, [username]);

    useEffect(() => {
        enableFreeDailyBoxButton();
    }, [timerComplete])

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
        if(timerComplete === false) return;
            else updateLastFreeBoxTime();
    }

    //enable button if ready
    const enableFreeDailyBoxButton = () => {
        const button =  document.getElementById('free-daily-box-button') as HTMLButtonElement;
        if(timerComplete === false){
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }


    return (
        <div>
            <Timer 
                lastOpenTime={lastFreeBoxTime}
                setTimerComplete={setTimerComplete}
                timerComplete={timerComplete}
            />
            <div>
                <button id='free-daily-box-button' onClick={() => checkIfCanOpen()}
                    className=' disabled:line-through'
                    >
                        Daily Free Currency!
                </button>
            </div>
        </div>
    )
}

export default CurrencyBox