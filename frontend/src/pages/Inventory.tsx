import { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item } from '../interface/inventoryType';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item [] | null>(null);

    useEffect(() => {
        handleItems();
    }, []);

    //fetch all the items that the account has
    const handleItems = async() => {
        const result = await inventoryApi.getAccountInventory(navigate);
        setItems(result!);
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        return items.map((item) => 
            <div>
                {item.name}
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