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
                opacity: 1
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
            delay: 1.5
        })
        
        
    }, [increaseSubstatObject])

    return (
        <div>
            {!currentItem || !currentItem.result ? (
                <div>
                    Loading....
                </div>
            ) : (
                <div>
                    <div id='item-stats' className='flex flex-col text-center'>
                        <div className='px-1'>
                            {currentItem.result.name.name}
                        </div>
                        <div className='px-1'>
                            Item Level: {currentItemLvl}
                        </div>
                        <div id='item-substats'>
                            <div id='substat1' className='flex justify-center'>
                                <div className='w-28'>
                                    {currentItem.result.substats[0].substatType.name}
                                </div>
                                <div className='flex pl-2 w-28'>
                                    <div>
                                        {currentItem.result.substats[0].value}
                                    </div>
                                    <div id='substat-increase-atk' className='pl-2'>
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
                                <div className='flex pl-2 w-28'>
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
                                <div className='flex pl-2 w-28'>
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
                    <div className='exp-bar'>
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
                    />
                    <div className='p-1'>
                        EXP Currency: {currentCurrency ?? 0}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpgradeItem