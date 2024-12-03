import React, { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item } from '../interface/inventoryType';
import { useNavigate, useParams } from 'react-router-dom';
import * as CurrencyApi from '../api/currency';
import { CurrencyIncreaseResponse } from '../interface/currencyTypes';
import { useUser } from '../middleware/UserContext';
import Cookies from 'js-cookie';
import gsap from 'gsap';

const Inventory = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item [] | null>(null);
    const [displayItems, setDisplayItems] = useState<Item [] | null>(null);
    const [sellAmount, setSellAmount] = useState<number | null>(null);
    const [sortType, setSortType] = useState<string>('default');
    const [isFilterClicked, setIsFilterClicked] = useState<boolean>(false);

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
    }, [userInfo]);

    //fetch all the items that the account has
    const handleItems = async() => {
        if(!userInfo) return;
        const result = await inventoryApi.getAccountInventory(navigate, userInfo!.username);
        if(!result) return;

        //sort the order of substats in each item
        const substatOrder = ['atk', 'hp', 'def'];
        result?.accountInventory.forEach((item) => {
            item.substats.sort((a,b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
        });

        setItems(result.accountInventory);
        setDisplayItems(result.accountInventory.sort((a, b) => a.id - b.id));
    }
    
    //change visibility
    const handleVisibility = (event: React.MouseEvent) => {
        const itemDiv = event.currentTarget.id;
    
        const substatDivPopup = document.getElementById(`substats-window-${itemDiv}`);
        substatDivPopup?.classList.replace('hidden', 'flex');
    }

    //close substat window
    const closeSubstatWindow = (substatIndex: number) => {
        const substatDivPopup = document.getElementById(`substats-window-${substatIndex}`);
        substatDivPopup?.classList.replace('flex', 'hidden');
    }
    
    //sorting functions switch case
    const sortItems = (sortType: string) => {
        setSortType(sortType);
        if(!items) return;

        //use a copy of the original fetched items
        const sortedItems = [...items];
        
        switch(sortType) {
            case 'idAsc':
                sortedItems.sort((a, b) => a.id - b.id);
                break;
            case 'idDes':
                sortedItems.sort((a, b) => b.id - a.id);
                break;
            case 'sortByHat':
                const hatOrder = ['hat', 'armor', 'sword'];
                sortedItems.sort((a, b) => b.exp - a.exp);
                sortedItems.sort((a, b) => hatOrder.indexOf(a.name.name) - hatOrder.indexOf((b.name.name)) );
                break;
            case 'sortByArmor':
                const armorOrder = ['armor', 'hat', 'sword'];
                sortedItems.sort((a, b) => b.exp - a.exp);
                sortedItems.sort((a, b) => armorOrder.indexOf(a.name.name) - armorOrder.indexOf((b.name.name)) );
                break;
            case 'sortBySword':
                const swordOrder = ['sword', 'hat', 'armor'];
                sortedItems.sort((a, b) => b.exp - a.exp);
                sortedItems.sort((a, b) => swordOrder.indexOf(a.name.name) - swordOrder.indexOf(b.name.name) );
                break;
            default : 
                sortedItems.sort((a, b) => a.id - b.id);
                break;
        }

        setDisplayItems(sortedItems);
    }

    //button press that changes sort type
    const handleSortButtonClick = (sortType: string) => {
        sortItems(sortType);
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
    const sellItemsForCurrency = async(itemId: number, sellAmount: number, index: number) => {
        
        if (sellAmount === 0) return;
        if(!username) return;
        
        //delete the item from inventory
        const deleteRequest = await inventoryApi.deleteItem(username, itemId);
        if(!deleteRequest) return;
        
        //increase currency after selling
        const increaseAmountRequest = { increaseAmount: sellAmount};
        const sellItemRequest: CurrencyIncreaseResponse = await CurrencyApi.increaseAccountCurrency(username, increaseAmountRequest);
        setSellAmount(sellItemRequest.result.currency);
        
        handleItems();

        // hide the div after selling the item
        const substatDivPopup = document.getElementById(`substats-window-${index}`);
        substatDivPopup?.classList.replace('flex', 'hidden');
        
    }
    
    //svg chooser
    const svgChooser = (itemType: string) => {
        if(itemType === 'sword') return '/sword.svg';
        else if (itemType === 'armor') return '/armor.svg';
        else return '/hat.svg';
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        if(!displayItems) return;
        return displayItems.map((item, index) => 
            <div key={index} className='w-28 py-2 outline outline-three rounded-lg m-2'>
                <div id={`${index}`} className='flex' onClick={(event) => handleVisibility(event)}>
                    <div className='flex flex-col'>
                        <div className='px-1'>
                            {item.name.name}
                        </div>
                        <div className='px-1'>
                            Level: {expToLevelConverter(item.exp)}
                        </div>
                    </div>
                    <svg className='w-4 h-4 ml-auto'>
                        <image xlinkHref={svgChooser(item.name.name)}></image>
                    </svg>
                </div>
                <div id={`substats${index}`} className='bg-one z-50'>
                    <div id={`substats-window-${index}`} className='hidden fixed top-0 left-0 justify-center z-50 bg-pink-200 bg-opacity-70 w-full max-h-full h-full'>
                        <div className='bg-four p-6 mt-auto mb-auto mx-2 rounded shadow-lg w-7/12 h-1/2 flex flex-col justify-between text-center outline outline-8 outline-two'>
                            <div>
                                {item.name.name}
                            </div>
                            <div>
                                Level: {expToLevelConverter(item.exp)}
                            </div>
                            <div id={`substats-for-item${index}`}>
                                <div id='substat1' className='flex justify-evenly'>
                                    <div className='flex'>
                                        <div className='fixed top-auto left-36'>
                                            {item.substats[0].substatType.name} 
                                        </div>
                                        <svg className='w-4 h-4 pt-0.5 ml-9 mt-1.5'>
                                            <image href='/sword.svg'></image>
                                        </svg>
                                    </div>
                                    <div>
                                        {item.substats[0].value}
                                    </div>
                                </div>
                                <div id='substat2' className='flex justify-evenly'>
                                    <div className='flex'>
                                        <div className='fixed top-auto left-36'>
                                            {item.substats[1].substatType.name}
                                        </div>
                                        <svg className='w-5 h-5 pt-1.5 ml-8'>
                                            <image href='/heart.svg'></image>
                                        </svg>
                                    </div>
                                    <div>
                                        {item.substats[1].value}
                                    </div>
                                </div>
                                <div id='substat3' className='flex justify-evenly'>
                                    <div className='flex'>
                                        <div className='fixed top-auto left-36'>
                                            {item.substats[2].substatType.name}
                                        </div>
                                        <svg className='w-5 h-5 pt-0.5 ml-8'>
                                            <image href='/shield.svg'></image>
                                        </svg>
                                    </div>
                                    <div>
                                        {item.substats[2].value}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-evenly w-full'>
                                <div id='enhance-button' className='w-36 h-12 bg-three outline outline-1 mr-4 text-four rounded-lg'>
                                    <button className='mt-3' onClick={() => navigateToSpecificItem(item.id)}>Enhance!</button>
                                </div>
                                <div id='sell-button' className='w-36 h-12 bg-five outline outline-1 text-four rounded-lg'>
                                    <button onClick={() => sellItemsForCurrency(item.id, (Math.floor(item.exp/2)), index ) }>Sell for {Math.floor(item.exp/2)} Currency</button>
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

    const handleFilterButtonPress = () => {
        const filterSvg = document.getElementById('filter-svg');
        const filterList = document.getElementById('filter-list');
        if(!filterSvg) return;
        if(!filterList) return;

        if(!isFilterClicked) {
            setIsFilterClicked(true);
            filterList.classList.remove('pointer-events-none');
            
            gsap.fromTo(filterSvg,
                {
                    width:44,
                },
                {
                    width:67,
                    duration: 0.1
                }
            )
            gsap.fromTo(filterList,
                {
                    opacity: 0,
                    height: 100
                },
                {
                    opacity:1,
                    height: 160,
                    duration: 0.3
                }
            )
            
            filterSvg.classList.replace('rounded-full', 'rounded-b-lg');

        } else {
            setIsFilterClicked(false);

            gsap.fromTo(filterSvg,
                {
                    width: 67
                },
                {
                    width: 44,
                    duration: 0.3
                }

            )
            gsap.fromTo(filterList,
                {
                    opacity: 1,
                    height: 160,
                },
                {
                    opacity: 0,
                    height: 120,
                    duration: 0.15,
                }
            )

            filterSvg.classList.replace('rounded-b-lg', 'rounded-full');
            filterList.classList.add('pointer-events-none');
        }
    }   

    return (
        // height is wonky because i had to subtract the navbar height; full screen h - navbar height
        <div className='flex flex-col h-[calc(100vh-32px)] bg-four'>
            <div className='flex flex-wrap flex-grow overflow-y-scroll py-1 max-h-[99%]'>
                {allItemNamesDiv()}
            </div>
            { sellAmount && 
            <div className='text-center bg-three'>
                Sold! Now you have {sellAmount} currency!
            </div> }
            <div className='fixed bottom-3 right-[25px] h-11 w-11 ml-auto bg-transparent'>
                <div className='z-50 max-h-11 ml-auto'>
                
                    <div id='filter-list' className='bg-three fixed bottom-[50px] right-0.5 text-four rounded-t-lg opacity-0 pointer-events-none'>
                        <div className='p-2'>
                            <button onClick={() => handleSortButtonClick(sortType === 'default' || sortType === 'idAsc'? 'idDes' : 'idAsc')}>
                                {sortType === 'default' || sortType === 'idAsc' ? 'New' : 'Old'}
                            </button>
                        </div>
                        <div className='p-2'>
                            <button onClick={() => handleSortButtonClick('sortByHat')}>
                                Hats
                            </button>
                        </div>
                        <div className='p-2'>
                            <button onClick={() => handleSortButtonClick('sortByArmor')}>
                                Armors
                            </button>                       
                        </div>
                        <div className='p-2'>
                            <button onClick={() => handleSortButtonClick('sortBySword')}>
                                Swords
                            </button>
                        </div> 
                    </div>
                  
                    <svg id='filter-svg' className='w-11 h-11 bg-three rounded-full pl-1.5 pt-1.5' onClick={handleFilterButtonPress}>
                        <image href='/filter.svg'></image>
                    </svg>
                </div>
                
            </div>
        </div>
    )
}

export default Inventory