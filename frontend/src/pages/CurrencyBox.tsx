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
import { useDebouncedCallback } from 'use-debounce';
import SkinOpeningAnimation from '../components/SkinOpeningAnimation';
import { SkinCaseData } from '../interface/CaseTypes';

const CurrencyBox = () => {
    const [lastFreeBoxTime, setLastFreeBoxTime] = useState<Date | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [timerComplete, setTimerComplete] = useState<boolean>(false);
    const [isOpeningCase, setIsOpeningCase] = useState<boolean>(false);
    const [winningAmount, setWinningAmount] = useState<string | null>(null);
    const [currency, setCurrency] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isOpeningSkinCase, setIsOpeningSkinCase] = useState<boolean>(false);
    const [skinWon, setSkinWon] = useState<SkinCaseData | null>(null);

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
    //reset won skin after rolling is done
    useEffect(() => {
        setSkinWon(null);
    }, [isOpeningSkinCase]);

    //fetch user currency
    useEffect(() => {
        fetchUserCurrency();
    }, [username, isOpeningCase]);

    //disable pay-box-button if animation is playing
    useEffect(() => {
        const paidBoxButton = document.getElementById('pay-box-button');
        const skinOpenButton = document.getElementById('skin-open-button');
        if(!paidBoxButton) return;
        if(!skinOpenButton) return;

        if(isOpeningCase || isOpeningSkinCase) {
            paidBoxButton.toggleAttribute('disabled');
            skinOpenButton.toggleAttribute('disabled');
        } else {
            paidBoxButton.removeAttribute('disabled');
            skinOpenButton.removeAttribute('disabled');
        }
    }, [isOpeningCase, isOpeningSkinCase]);

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
        if(timerComplete && !isOpeningCase) {
            setErrorMessage(null);
            updateLastFreeBoxTime();
            setIsOpeningCase(true);
        }
    }

    const testAnimation = () => {
        !isOpeningSkinCase ? setIsOpeningSkinCase(true) : setIsOpeningSkinCase(false)
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

    const openSkinCase = async() => {
        setErrorMessage(null);
        if(currency && currency < 200) {
            setErrorMessage('Not Enough Currency!');
            return;
        }
        if(!username) return;
        const currencyDecrease: CurrencyDecreaseResponse = await CurrencyApi.decreaseAccountCurrency(username, { decreaseAmount: 200 });
        setCurrency(currencyDecrease.result.currency);
        setIsOpeningSkinCase(true);
    }

    function rarityFromcolor(rarity: string) {
        const rarityColors: { [key:string]: string } = {
            'common': 'bg-green-200',
            'rare': 'bg-blue-200',
            'epic': 'bg-purple-600',
        };
        return rarityColors[rarity] || 'bg-yellow-400'
    }

    //make sure mulitple api calls to open currency do not go through
    const debounceCall = useDebouncedCallback(() => openGambleCase(), 200);

    return (
        <div className='flex flex-col'>
            <Timer 
                lastOpenTime={lastFreeBoxTime}
                setTimerComplete={setTimerComplete}
                timerComplete={timerComplete}
            />
            <div className='flex flex-col text-four mt-2'>
                <div className='text-one text-center w-24 p-1 mx-auto border-b-2 border-b-one'>Currency</div>
                <button id='free-daily-box-button' onClick={() => checkIfCanOpen()}
                    className='disabled:line-through disabled:bg-one p-1 bg-two w-fit mx-auto mt-2 rounded-lg active:bg-five'
                    >
                        Daily Free Currency!
                </button>
                <button id='pay-box-button' className='p-1 bg-three w-fit mx-auto mt-2 rounded-lg active:bg-five' onClick={() => debounceCall()}>Gamble for Currency (50)</button>
            </div>
            {isOpeningCase && <CaseOpeningAnimation setWinningAmount={setWinningAmount} setIsOpeningCase={setIsOpeningCase} />}
            <div className='text-center'>
                {winningAmount && 
                    <div id='winning-amount' className='m-2 w-fit p-1 mx-auto bg-five text-four rounded-lg'>
                        You won {winningAmount}!
                    </div>
                }
            </div>

            <div id='skin-gamble-divs' className='mt-6'>
                <div className='w-10 border-b-2 border-b-one mx-auto'>Skins</div>
                <div className='w-fit h-fit mx-auto'>
                    <img className='' src={'/caseoutline.png'}></img>
                </div>
            </div>
            <div className='w-fit h-fit p-1 bg-two text-four rounded-md mx-auto active:bg-one'>
                <button id='skin-open-button' onClick={() => testAnimation()}>Open for 200</button>
            </div>
            {isOpeningSkinCase && <SkinOpeningAnimation setSkinWon={setSkinWon} setIsOpeningSkinCase={setIsOpeningSkinCase} username={userInfo!.username}/>}
            <div className='text-center'>
                {skinWon && 
                    <div>
                        <div className='bg-five absolute top-0 left-0 w-screen h-screen z-50 flex justify-center bg-opacity-50'>
                            <div className='bg-four w-2/3 h-1/2 my-auto flex flex-col rounded-md'>
                                <div className='mt-5'>
                                    You won the {skinWon.name.substring(0, skinWon.name.length - 1)} skin!
                                </div>
                                <div className={`mt-2 p-1 text-four ${rarityFromcolor(skinWon.rarity.name)} w-fit rounded-md mx-auto`} >{skinWon.rarity.name}</div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div>
                {errorMessage &&
                    <div className='w-fit mx-auto bg-one text-four p-1 rounded-lg'>
                        {errorMessage}
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