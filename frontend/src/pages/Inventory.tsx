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
    const allItemNames = () => {
        if(!items) return;
        for(let item of items) {
            return (
                <div>
                    {item.name}
                </div>
            )
        }
    }

    return (
        <div>
            {allItemNames()}
        </div>
    )
}

export default Inventory