import React, { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventory';
import { Item } from '../interface/inventoryType';
import { useNavigate } from 'react-router-dom';
import { getAccountFromToken } from '../api/login';
import { AccountInfoType } from '../interface/accountTypes';

const Inventory = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item [] | null>(null);
    
    useEffect(() => {
        handleItems();
    }, []);
    
    //fetch all the items that the account has
    const handleItems = async() => {
        const user: AccountInfoType = await getAccountFromToken(navigate);
        const result = await inventoryApi.getAccountInventory(navigate, user.username);
        setItems(result!.accountInventory);
    }
    
    //change visibility
    const handleVisibility = (event: React.MouseEvent) => {
        const itemDiv = event.currentTarget.id;
        const substatDiv = document.getElementById(`substats${itemDiv}`);
        if(substatDiv) substatDiv.classList.toggle('hidden');
    }

    //collapse all items
    const hideAll = () => {
        const substatDivs = document.querySelectorAll('[id*="substats"]');
        substatDivs.forEach((element) => element.classList.add('hidden'));
    }

    //Reveal all items
    const showAll = () => {
        const substatDivs = document.querySelectorAll('[id*="substats"]');
        substatDivs.forEach((element) => element.classList.remove('hidden'));
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        return items.map((item, index) => 
            <div key={index}>
                <div id={`${index}`} onClick={(event) => handleVisibility(event)}>
                    {item.name.name}
                </div>
                <div>
                    {item.level}
                </div>
                <div id={`substats${index}`} className='hidden bg-slate-400'>
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
            <div>
                {allItemNamesDiv()}
            </div>
            <div>
                <button onClick={()=>hideAll()}>
                    Collapse All Items
                </button>
            </div>
            <div>
                <button onClick={()=>showAll()}>
                    Reveal All Items
                </button>
            </div>
        </div>
    )
}

export default Inventory