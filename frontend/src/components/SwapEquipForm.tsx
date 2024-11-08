import React, { useState } from 'react'
import { Item } from '../interface/inventoryType'

interface Props {
    itemType: string,
    itemData: Item | null
}

const SwapEquipForm: React.FC<Props> = (props) => {
    const [itemTypes, setItemTypes] = useState<Item[] | null>(null);

    const fetchItemType = async() => {
       
    }

    return (
        <div>{props.itemData ? props.itemData.id : 'pluh'}</div>
    )
}

export default SwapEquipForm