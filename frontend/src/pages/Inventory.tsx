import React, { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item } from '../interface/inventoryType';
import { useNavigate, useParams } from 'react-router-dom';
import * as CurrencyApi from '../api/currency';
import { CurrencyIncreaseResponse } from '../interface/currencyTypes';
import { useUser } from '../middleware/UserContext';
import Cookies from 'js-cookie';

const Inventory = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item [] | null>(null);
    const [sellAmount, setSellAmount] = useState<number | null>(null);

    const { userInfo, fetchUserInfo } = useUser();

    const token = Cookies.get('token');

    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate, token]);

    useEffect(() => {
        handleItems();
    }, [items, userInfo]);
    
    //fetch all the items that the account has
    const handleItems = async() => {
        if(!userInfo) return;
        const result = await inventoryApi.getAccountInventory(navigate, userInfo!.username);

        //sort items in order
        result?.accountInventory.sort((a, b) => a.id - b.id);

        //sort the order of substats in each item
        const substatOrder = ['atk', 'hp', 'def'];
        result?.accountInventory.forEach((item) => {
            item.substats.sort((a,b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
        });

        setItems(result!.accountInventory);
    }
    
    //change visibility
    const handleVisibility = (event: React.MouseEvent) => {
        const itemDiv = event.currentTarget.id;
    
        const substatDivPopup = document.getElementById(`substats-window-${itemDiv}`);
        substatDivPopup?.classList.replace('hidden', 'flex');
        
    }
    
    //collapse all items
    const hideAll = () => {
        const substatDivs = document.querySelectorAll('[id*="substats"]');
        substatDivs.forEach((element) => element.classList.add('hidden'));
    }
    
    //Reveal all items
    const showAll = () => {
        const substatDivs = document.querySelectorAll('[id*="substats"]');
        substatDivs.forEach((element) => element.classList.remove('hidden'));
        substatDivs.forEach((element) => element.classList.add('flex'));
        substatDivs.forEach((element) => element.classList.add('flex-col'));
        substatDivs.forEach((element) => element.classList.add('text-center'));
    }

    //Navigate to enhance page
    const navigateToSpecificItem = async(itemId: number) => {
        if(!userInfo) return;
        navigate(`/${userInfo.username}/inventory/${itemId}`);
    }

    //convert exp to level to display
    const expToLevelConverter = (exp: number) => {
        if (exp < 10) return 0;
        if (exp < 30) return 1;
        if (exp < 60) return 2;
        if (exp < 100) return 3;
        return 'MAX';
    };

    //sell items for currency
    const { username } = useParams();
    const sellItemsForCurrency = async(itemId: number, sellAmount: number) => {
        if (sellAmount === 0) return;
        if(!username) return;

        //delete the item from inventory
        const deleteRequest = await inventoryApi.deleteItem(username, itemId);
        if(!deleteRequest) return;

        //increase currency after selling
        const increaseAmountRequest = { increaseAmount: sellAmount};
        const sellItemRequest: CurrencyIncreaseResponse = await CurrencyApi.increaseAccountCurrency(username, increaseAmountRequest);
        setSellAmount(sellItemRequest.result.currency);

    }

    //close substat window
    const closeSubstatWindow = (substatIndex: number) => {
        const substatDivPopup = document.getElementById(`substats-window-${substatIndex}`);
        substatDivPopup?.classList.replace('flex', 'hidden');
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        return items.map((item, index) => 
            <div key={index} className='w-24 py-2'>
                <div id={`${index}`} className='px-1' onClick={(event) => handleVisibility(event)}>
                    {item.name.name}
                </div>
                <div className='px-1'>
                    Level: {expToLevelConverter(item.exp)}
                </div>
                <div id={`substats${index}`} className=' bg-slate-400'>
                    <div id={`substats-window-${index}`} className='hidden fixed top-0 left-0 justify-center z-50 bg-blue-600 bg-opacity-70 w-full max-h-full h-full'>
                        <div className='bg-white p-6 mt-auto mb-auto mx-2 rounded shadow-lg w-7/12 h-1/2 flex flex-col justify-between text-center'>
                            <div>
                                {item.name.name}
                            </div>
                            <div>
                                Level: {expToLevelConverter(item.exp)}
                            </div>
                            <div id={`substats-for-item${index}`}>
                                <div id='substat1'>
                                    <div>
                                        {item.substats[0].substatType.name}
                                    </div>
                                    <div>
                                        {item.substats[0].value}
                                    </div>
                                </div>
                                <div id='substat2'>
                                    <div>
                                        {item.substats[1].substatType.name}
                                    </div>
                                    <div>
                                        {item.substats[1].value}
                                    </div>
                                </div>
                                <div id='substat3'>
                                    <div>
                                        {item.substats[2].substatType.name}
                                    </div>
                                    <div>
                                        {item.substats[2].value}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-evenly w-full'>
                                <div id='enhance-button' className='w-36'>
                                    <button onClick={() => navigateToSpecificItem(item.id)}>Enhance!</button>
                                </div>
                                <div id='sell-button' className='w-36'>
                                    <button onClick={() => sellItemsForCurrency(item.id, (Math.floor(item.exp/2)) ) }>Sell for {Math.floor(item.exp/2)} Currency</button>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => closeSubstatWindow(index)}>Exit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-wrap justify-evenly py-2'>
                {allItemNamesDiv()}
            </div>

            { sellAmount && 
            <div className='text-center'>
                Sold! Now you have {sellAmount} currency!
            </div> }

            <div className='text-center'>
                <button onClick={()=>hideAll()}>
                    Collapse All Items
                </button>
            </div>
            <div className='text-center'>
                <button onClick={()=>showAll()}>
                    Reveal All Items
                </button>
            </div>
        </div>
    )
}

export default Inventory