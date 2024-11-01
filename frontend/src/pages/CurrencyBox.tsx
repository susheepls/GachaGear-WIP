import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AccountInfoType } from '../interface/accountTypes';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { getAccountFromToken } from '../api/login';
import * as BoxApi from '../api/boxTime';
import Timer from '../components/Timer';
import CaseOpeningAnimation from '../components/CaseOpeningAnimation';
import * as CurrencyApi from '../api/currency';
import { CurrencyIncreaseResponse } from '../interface/currencyTypes';

const CurrencyBox = () => {
    const [lastFreeBoxTime, setLastFreeBoxTime] = useState<Date | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [timerComplete, setTimerComplete] = useState<boolean>(false);
    const [isOpeningCase, setIsOpeningCase] = useState<boolean>(false);
    const [winningAmount, setWinningAmount] = useState<string | null>(null);
    const [newCurrentCurrency, setNewCurrentCurrency] = useState<number | null>(null);

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
    }, [timerComplete]);

    //add currency after the win
    useEffect(() => {
        addCurrencyAfterWin();
    }, [winningAmount]);

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
        if(timerComplete) {
            updateLastFreeBoxTime();
            setIsOpeningCase(true);
        }
    }

    const testAnimation = () => {
        !isOpeningCase ? setIsOpeningCase(true) : setIsOpeningCase(false)
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

    //add currency after winning
    const addCurrencyAfterWin = async() => {
        if(!winningAmount || !username) return;
        const currencyAmount = Number(winningAmount);
        const winningAmountObj = { increaseAmount: currencyAmount };
        const accountCurrencyChange: CurrencyIncreaseResponse = await CurrencyApi.increaseAccountCurrency(username, winningAmountObj);
        setNewCurrentCurrency(accountCurrencyChange.result.currency);
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
                <button onClick={() => checkIfCanOpen()}>Test animation</button>
            </div>
            {isOpeningCase && <CaseOpeningAnimation setWinningAmount={setWinningAmount} />}
            <div className='text-center'>
                {winningAmount && 
                    <div>
                        You won {winningAmount};
                    </div>
                }
            </div>
            <div>
                {isOpeningCase && newCurrentCurrency &&
                    <div>
                        you now have {newCurrentCurrency}
                    </div>
                }
            </div>
        </div>
    )
}

export default CurrencyBox