import { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item } from '../interface/inventoryType';
import { useLocation, useNavigate } from 'react-router-dom';

const Inventory = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item [] | null>(null);
    const infoFromHome = useLocation();
    const username = infoFromHome.state.username;

    useEffect(() => {
        handleItems();
    }, []);

    //fetch all the items that the account has
    const handleItems = async() => {
        const result = await inventoryApi.getAccountInventory(navigate, username);
        setItems(result!.accountInventory);
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        return items.map((item, index) => 
            <div key={index}>
                <div>
                    {item.name.name}
                </div>
                <div>
                    {item.level}
                </div>
                <div id='substats' className='hidden'>
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
               
            </div>
        );
    }

    return (
        <div>
            {allItemNamesDiv()}
        </div>
    )
}

export default Inventory