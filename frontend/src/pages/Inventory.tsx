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
        if(substatDiv) {
            substatDiv.classList.toggle('hidden');
            substatDiv.classList.add('flex');
            substatDiv.classList.add('flex-col');
            substatDiv.classList.add('text-center');
        }
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
        substatDivs.forEach((element) => element.classList.add('flex'));
        substatDivs.forEach((element) => element.classList.add('flex-col'));
        substatDivs.forEach((element) => element.classList.add('text-center'));
    }

    //return a div for each item
    const allItemNamesDiv = () => {
        if(!items) return;
        return items.map((item, index) => 
            <div key={index}>
                <div id={`${index}`} className='px-1' onClick={(event) => handleVisibility(event)}>
                    {item.name.name}
                </div>
                <div className='px-1'>
                    {item.exp}
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
                    <div>
                        <button>Enhance!</button>
                    </div>
                </div>
               
            </div>
        );
    }

    return (
        <div className='flex flex-col'>
            <div>
                {allItemNamesDiv()}
            </div>
            <div className='text-center'>
                <button onClick={()=>hideAll()}>
                    Collapse All Items
                </button>
            </div>
            <div className='text-center'>
                <button onClick={()=>showAll()}>
                    Reveal All Items
                </button>
            </div>
        </div>
    )
}

export default Inventory