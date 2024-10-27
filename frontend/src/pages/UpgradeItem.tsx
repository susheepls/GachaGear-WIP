import { useEffect, useState} from 'react'
import { EnhanceOneItemType } from '../interface/inventoryType'
import * as inventoryApi from '../api/inventory'
import { useParams } from 'react-router-dom';
import EnhanceForm from '../components/EnhanceForm';
import { ItemSubstatIncrease } from '../interface/itemType';
import * as CurrencyApi from '../api/currency';

const UpgradeItem = () => {
    const [currentItem, setCurrentItem] = useState<EnhanceOneItemType | null>(null);
    const [currentItemLvl, setCurrentItemLvl] = useState<number | string | null>(null);
    const [remainingExp, setRemainingExp] = useState<number | string | null>(null);
    const [increaseSubstatObject, setIncreaseSubstatObject] = useState<ItemSubstatIncrease | null>(null);
    const [currentCurrency, setCurrentCurrency] = useState<number | null>(null);

    const { username, id } = useParams();

    useEffect(() => {
        fetchItemData();
    }, [currentItem]);

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
        fetchAccountCurrency();
    }, [currentCurrency]);

    //Fetch Data for one item
    const fetchItemData = async() => {
        if(!username || !id) return;
        const item = await inventoryApi.getOneItem(username, Number(id));
        if(!item) return;

        //sort substats in consistent order
        const substatOrder = ['atk', 'hp', 'def'];
        item.result?.substats.sort((a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name));
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

        if(!fetchAccountCurrency) return;
        setCurrentCurrency(fetchAccountCurrency); 
    }

    return (
        <div>
            {!currentItem || !currentItem.result ? (
                <div>
                    Loading....
                </div>
            ) : (
                <div>
                    <div id='item-stats'>
                        <div className='px-1'>
                            {currentItem.result.name.name}
                        </div>
                        <div className='px-1'>
                            Item Level: {currentItemLvl}
                        </div>
                        <div id='item-substats'>
                            <div id='substat1'>
                                <div>
                                    {currentItem.result.substats[0].substatType.name}
                                </div>
                                <div>
                                    {currentItem.result.substats[0].value}
                                </div>
                            </div>
                            <div id='substat2'>
                                <div>
                                    {currentItem.result.substats[1].substatType.name}
                                </div>
                                <div>
                                    {currentItem.result.substats[1].value}
                                </div>
                            </div>
                            <div id='substat3'>
                                <div>
                                    {currentItem.result.substats[2].substatType.name}
                                </div>
                                <div>
                                    {currentItem.result.substats[2].value}
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
                </div>
            )}
        </div>
    )
}

export default UpgradeItem