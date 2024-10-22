import { useEffect, useState} from 'react'
import { EnhanceOneItemType } from '../interface/inventoryType'
import * as inventoryApi from '../api/inventory'
import { useParams } from 'react-router-dom';

const UpgradeItem = () => {
    const [currentItem, setCurrentItem] = useState<EnhanceOneItemType | null>(null);

    const { username, id } = useParams();

    useEffect(() => {
        fetchItemData()
    }, []);

    //Fetch Data for one item
    const fetchItemData = async() => {
        if(!username || !id) return;
        const item = await inventoryApi.getOneItem(username, Number(id));
        if(!item) return;
        setCurrentItem(item);
    }

    return (
        <div>
            {!currentItem || !currentItem.result ? (
                <div>
                    Error Accessing Item Info
                </div>
            ) : (
                <div id='item-stats'>
                    <div className='px-1'>
                        {currentItem.result.name.name}
                    </div>
                    <div className='px-1'>
                        {currentItem.result.exp}
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
            )}
        </div>
    )
}

export default UpgradeItem