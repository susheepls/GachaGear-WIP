import { useEffect, useState} from 'react'
import { EnhanceOneItemType } from '../interface/inventoryType'
import * as inventoryApi from '../api/inventory'
import { useParams } from 'react-router-dom';
import EnhanceForm from '../components/EnhanceForm';
import { ItemSubstatIncrease } from '../interface/itemType';
import * as CurrencyApi from '../api/currency';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const UpgradeItem = () => {
    const [currentItem, setCurrentItem] = useState<EnhanceOneItemType | null>(null);
    const [currentItemLvl, setCurrentItemLvl] = useState<number | string | null>(null);
    const [remainingExp, setRemainingExp] = useState<number | string | null>(null);
    const [increaseSubstatObject, setIncreaseSubstatObject] = useState<ItemSubstatIncrease | null>(null);
    const [currentCurrency, setCurrentCurrency] = useState<number | null>(null);
    const [substatIncreaseHistory, setSubstatIncreaseHistory] = useState<ItemSubstatIncrease[]>([]);

    const { username, id } = useParams();

    useEffect(() => {
        fetchItemData();
    }, [username, id, increaseSubstatObject]);

    //convert exp to level on load
    useEffect(() => {
        expToLevel();
    }, [remainingExp]);

    //display how much exp til next lvl
    useEffect(() => {
        remainingExpDisplay();
    }, [currentItem]);

    //fetch and set account currency
    useEffect(() => {
        fetchAccountCurrency()
    }, [currentItem]);

    //Fetch Data for one item
    const fetchItemData = async() => {
        if(!username || !id) return;
        const item = await inventoryApi.getOneItem(username, Number(id));
        if(!item) return;

        //sort substats in consistent order
        if (item.result?.substats) {
            const substatOrder = ['atk', 'hp', 'def'];
            item.result.substats = [...item.result.substats].sort(
                (a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name)
            );
        }
        setCurrentItem(item);
    }

    //convert exp to level to display
    const expToLevel = () => {
        const expToLevelConverter = (exp: number) => {
            if (exp < 10) return 0;
            if (exp < 30) return 1;
            if (exp < 60) return 2;
            if (exp < 100) return 3;
            return 'MAX';
        };

        if(currentItem && currentItem.result) setCurrentItemLvl(expToLevelConverter(currentItem.result.exp))
        else return;
    }

    //display how much credits/exp til next level
    const remainingExpDisplay = () => {
        const remainingExpConverter = (exp: number) => {
            const breakPoints = [10, 30, 60, 100];
            for(let point of breakPoints) {
                if(exp < point) {
                    return point - exp;
                }
            }
            return 'MAX';
        };

        if(currentItem && currentItem.result) setRemainingExp(remainingExpConverter(currentItem.result.exp))
        else return;
    }

    //fetch account currency
    const fetchAccountCurrency = async() => {
        if(!username) return;
        const fetchAccountCurrency = await CurrencyApi.getAccountCurrency(username);
        if(fetchAccountCurrency === null || fetchAccountCurrency === undefined) return;
        setCurrentCurrency(fetchAccountCurrency); 
    }

    //animation to show the increase in substat value
    useGSAP(()=> {
        if(!increaseSubstatObject) return;

        const substatType = increaseSubstatObject.result.substatType.name;
        const substatIncreaseDiv = document.getElementById(`substat-increase-${substatType}`);

        if(!substatIncreaseDiv) return;

        gsap.killTweensOf(substatIncreaseDiv);

        gsap.fromTo(substatIncreaseDiv, 
            { 
                textContent: 0, 
                opacity: 1,
                y: 0
            },
            { 
                textContent: increaseSubstatObject.result.increaseValue,
                duration: 1.5,
                snap: { textContent: 1 }
            }
        );
        gsap.to(substatIncreaseDiv, {
            opacity: 0,
            duration: 1.5,
            delay: 1.5,
            y: -50,
        })
        
        
    }, [increaseSubstatObject])

    useGSAP(() => {
        if(!substatIncreaseHistory) return;
        if(substatIncreaseHistory.length < 1) return;
        const substatHistoryDiv = document.getElementById('upgrade-history');
        if(!substatHistoryDiv) return;
        const height = substatHistoryDiv.clientHeight;
        console.log(height)

        gsap.to(substatHistoryDiv,
            {
                height: height + 30
            }
        )

    }, [substatIncreaseHistory])

    //svg chooser
    const svgChooser = (itemType: string) => {
        if(itemType === 'sword') return '/sword.svg';
        else if (itemType === 'armor') return '/armor.svg';
        else return '/hat.svg';
    }

    return (
        <div>
            {!currentItem || !currentItem.result ? (
                <div>
                    Loading....
                </div>
            ) : (
                <div className='outline outline-2 outline-three m-1'>
                    <div id='item-stats' className='flex flex-col text-center'>
                        <div className='px-1'>
                            {currentItem.result.name.name}
                        </div>
                        <div className='mx-auto'>
                            <svg className='h-3 w-3'>
                                <image href={svgChooser(currentItem.result.name.name)}></image>
                            </svg>
                        </div>
                        <div className='px-1 border-b-2 border-one w-40 mx-auto'>
                            Item Level: {currentItemLvl}
                        </div>
                        <div id='item-substats'>
                            <div id='substat1' className='flex justify-center'>
                                <div className='w-28'>
                                    {currentItem.result.substats[0].substatType.name}
                                </div>
                                <div className='flex pl-8 w-28'>
                                    <div>
                                        {currentItem.result.substats[0].value}
                                    </div>
                                    <div id='substat-increase-atk' className='pl-2 text-two'>
                                        { increaseSubstatObject && 
                                        increaseSubstatObject.result.substatType.name === 'atk' && 
                                        increaseSubstatObject.result.increaseValue }
                                    </div>
                                </div>
                            </div>
                            <div id='substat2' className='flex justify-center'>
                                <div className='w-28'>
                                    {currentItem.result.substats[1].substatType.name}
                                </div>
                                <div className='flex pl-8 w-28'>
                                    <div>
                                        {currentItem.result.substats[1].value}
                                    </div>
                                    <div id='substat-increase-hp' className='pl-2'>
                                        { increaseSubstatObject && 
                                            increaseSubstatObject.result.substatType.name === 'hp' && 
                                            increaseSubstatObject.result.increaseValue }
                                    </div>
                                </div>
                            </div>
                            <div id='substat3' className='flex justify-center'>
                                <div className='w-28'>
                                    {currentItem.result.substats[2].substatType.name}
                                </div>
                                <div className='flex pl-8 w-28'>
                                    <div>
                                        {currentItem.result.substats[2].value}
                                    </div>
                                    <div id='substat-increase-def' className='pl-2'>
                                        { increaseSubstatObject && 
                                            increaseSubstatObject.result.substatType.name === 'def' && 
                                            increaseSubstatObject.result.increaseValue }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='exp-bar text-center mt-2'>
                        <div>
                            Current EXP = {currentItem.result.exp}
                        </div>
                        <div className='exp-til-next'>
                            EXP for next substat upgrade = {remainingExp}
                        </div>
                    </div>
                    <EnhanceForm
                        remainingExp = {remainingExp}
                        username = {username}
                        itemId = {id}
                        setCurrentItem = {setCurrentItem}
                        currentItem = {currentItem}
                        setIncreaseSubstatObject = {setIncreaseSubstatObject}
                        currentCurrency = {currentCurrency}
                        setCurrentCurrency = {setCurrentCurrency}
                        setSubstatIncreaseHistory = {setSubstatIncreaseHistory}
                    />
                    <div className='p-1 bg-two text-four mt-4 flex outline outline-four w-fit mx-auto justify-center rounded-md'>
                        <div>
                            EXP Currency: {currentCurrency ?? 0}
                        </div>
                        <div className='w-4 h-4 pt-0.5 ml-1'>
                            <svg className='w-4 h-4 pt-0.5'>
                                <image href='/currency.svg'></image>
                            </svg>                    
                        </div>
                    </div>
                </div>
            )}
            <div id='upgrade-history' className='w-2/3 mx-auto outline outline-2 mt-6 rounded-md outline-two text-one'>
                <div className='mt-2 w-36 text-center mx-auto border-b-2 border-one '>
                    Upgrade History
                </div>
                {increaseSubstatObject && 
                <div className='flex flex-col w-36 mx-auto'>
                    {substatIncreaseHistory.map((substatIncrease, index) => 
                    <div key={index} id={index+'upgrade-history'} className='flex m-1'>
                        <div>
                            {substatIncrease.result.substatType.name}
                        </div>
                        <div className='ml-auto'>
                            +{substatIncrease.result.increaseValue}
                        </div>
                    </div>
                    )}
                </div>
                }
            </div>
        </div>
    )
}

export default UpgradeItem