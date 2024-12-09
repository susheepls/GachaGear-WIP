import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import * as BoxApi from '../api/boxTime';
import Timer from '../components/Timer';
import CaseOpeningAnimation from '../components/CaseOpeningAnimation';
import * as CurrencyApi from '../api/currency';
import { CurrencyDecreaseResponse, CurrencyIncreaseResponse } from '../interface/currencyTypes';
import { useUser } from '../middleware/UserContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CurrencyBox = () => {
    const [lastFreeBoxTime, setLastFreeBoxTime] = useState<Date | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [timerComplete, setTimerComplete] = useState<boolean>(false);
    const [isOpeningCase, setIsOpeningCase] = useState<boolean>(false);
    const [winningAmount, setWinningAmount] = useState<string | null>(null);
    const [currency, setCurrency] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const token = Cookies.get('token');
    const navigate = useNavigate();
    const { userInfo, fetchUserInfo } = useUser();

    useGSAP(() => {
        const winningAmountDiv = document.getElementById('winning-amount');
        if(!winningAmount) return;

        const currencyAmountDiv = document.getElementById('currency-display-amount');
        if(!currencyAmountDiv) return;

        gsap.fromTo(winningAmountDiv, 
            {
                opacity:0
            },
            {
                opacity:1
            }
        )

        gsap.fromTo(currencyAmountDiv, 
            {
                textContent: currency
            },
            {
                textContent: currency! + Number(winningAmount),
                duration: 1,
                snap: { textContent: 1 }
            }
        )

    }, [winningAmount])
    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate, token]);

    useEffect(() => {
        const getUserInfoFromContext = async() => {
            if(userInfo) {
                setUsername(userInfo.username);
                setIsLoading(false);
            } else {
                await fetchUserInfo(navigate);
                setIsLoading(false);
            }
        };
        getUserInfoFromContext();
    }, [userInfo, fetchUserInfo, navigate]);

    // If loading is complete and userInfo is still null, navigate to login
    useEffect(() => {
        if (!isLoading && !userInfo) {
            navigate('/login');
        }
    }, [isLoading, userInfo, navigate]);

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

    //reset winning amount new current currency after rolling is done
    useEffect(() => {
        setWinningAmount(null);
    }, [isOpeningCase]);

    //fetch user currency
    useEffect(() => {
        fetchUserCurrency();
    }, [username, isOpeningCase]);

    //disable pay-box-button if animation is playing
    useEffect(() => {
        const paidBoxButton = document.getElementById('pay-box-button');
        
        if(!paidBoxButton) return;
        if(isOpeningCase) {
            paidBoxButton.toggleAttribute('disabled');
        } else {
            paidBoxButton.removeAttribute('disabled');
        }
    }, [isOpeningCase]);

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
            setErrorMessage(null);
            updateLastFreeBoxTime();
            setIsOpeningCase(true);
        }
    }

    // const testAnimation = () => {
    //     !isOpeningCase ? setIsOpeningCase(true) : setIsOpeningCase(false)
    // }

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
        const accountCurrencyChange: CurrencyIncreaseResponse= await CurrencyApi.increaseAccountCurrency(username, winningAmountObj);
        setCurrency(accountCurrencyChange.result.currency);
    }  

    //fetch user currency
    const fetchUserCurrency = async() => {
        if(!username) return;
        const userCurrency = await CurrencyApi.getAccountCurrency(username);
        if(!userCurrency) return;
        setCurrency(userCurrency);
    };

    const openGambleCase = async() => {
        setErrorMessage(null);
        if(currency && currency < 50) {
            setErrorMessage('Not Enough Currency!');
            return;
        }
        if(!username) return;
        const currencyDecrease: CurrencyDecreaseResponse = await CurrencyApi.decreaseAccountCurrency(username, { decreaseAmount: 50 });
        setCurrency(currencyDecrease.result.currency);
        setIsOpeningCase(true);
    }

    return (
        <div className='flex flex-col'>
            <Timer 
                lastOpenTime={lastFreeBoxTime}
                setTimerComplete={setTimerComplete}
                timerComplete={timerComplete}
            />
            <div className='flex flex-col text-four mt-6'>
                <button id='free-daily-box-button' onClick={() => checkIfCanOpen()}
                    className='disabled:line-through disabled:bg-one p-1 bg-two w-fit mx-auto mt-2 rounded-lg active:bg-five'
                    >
                        Daily Free Currency!
                </button>
                <button id='pay-box-button' className='p-1 bg-three w-fit mx-auto mt-2 rounded-lg active:bg-five' onClick={() => openGambleCase()}>Gamble for Currency (50)</button>
            </div>
            <div>
                {errorMessage &&
                    <div className='w-fit mx-auto bg-one text-four p-1 rounded-lg'>
                        {errorMessage}
                    </div>
                }
            </div>
            {/* <div>
                <button onClick={() => testAnimation()}>Test animation</button>
            </div> */}
            {isOpeningCase && <CaseOpeningAnimation setWinningAmount={setWinningAmount} setIsOpeningCase={setIsOpeningCase} />}
            <div className='text-center'>
                {winningAmount && 
                    <div id='winning-amount' className='m-2 w-fit p-1 mx-auto bg-five text-four rounded-lg'>
                        You won {winningAmount}!
                    </div>
                }
            </div>
            <div className='flex w-fit p-1 mx-auto text-white bg-three mt-10 rounded-lg '>
                <div id='currency-display-amount'>
                    {currency} 
                </div>
                <div className='ml-2'>
                    currency
                </div>
            </div>
        </div>
    )
}

export default CurrencyBox