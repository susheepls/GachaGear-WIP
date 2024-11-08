import React, { useEffect, useState } from 'react'
import { Item } from '../interface/inventoryType'
import * as InventoryApi from '../api/inventory'
interface Props {
    itemType: string,
    itemData: Item | null,
    username: string | null,
}

const SwapEquipForm: React.FC<Props> = (props) => {
    const [itemTypes, setItemTypes] = useState<Item[] | null>(null);

    useEffect(() => {
        fetchItemType();
    }, [props.itemType, props.itemData])

    const fetchItemType = async() => {
        const itemType = props.itemType;
        
        const username = props.username;
        if(!username) return;

        const itemsByType = await InventoryApi.getAccountItemsByType(username, itemType);

        if(!itemsByType) return;
        setItemTypes(itemsByType);
    }

    return (
        <div>{props.itemData ? props.itemData.id : 'pluh'}</div>
    )
}

export default SwapEquipForm