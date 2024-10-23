import { useEffect, useState} from 'react'
import { EnhanceOneItemType } from '../interface/inventoryType'
import * as inventoryApi from '../api/inventory'
import { useParams } from 'react-router-dom';

const UpgradeItem = () => {
    const [currentItem, setCurrentItem] = useState<EnhanceOneItemType | null>(null);
    const [currentItemLvl, setCurrentItemLvl] = useState<number | string | null>(null);
    const [remainingExp, setRemainingExp] = useState<number | string | null>(null);

    const { username, id } = useParams();

    useEffect(() => {
        fetchItemData();
    }, []);

    //convert exp to level on load
    useEffect(() => {
        expToLevel();
    }, [currentItem]);

    //display how much exp til next lvl
    useEffect(() => {
        remainingExpDisplay()
    }, [currentItem])

    //Fetch Data for one item
    const fetchItemData = async() => {
        if(!username || !id) return;
        const item = await inventoryApi.getOneItem(username, Number(id));
        if(!item) return;
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
                </div>
            )}
        </div>
    )
}

export default UpgradeItem