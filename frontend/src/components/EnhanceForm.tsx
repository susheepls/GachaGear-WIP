import React, { FormEvent, SetStateAction, useEffect, useState } from 'react'
import { EnhanceItemExp, ItemSubstatIncrease } from '../interface/itemType'
import * as ItemApi from '../api/item';
import { EnhanceOneItemType } from '../interface/inventoryType';

interface Props{
    remainingExp: number | string | null
    username: string | undefined,
    itemId: string | undefined,
    setCurrentItem: React.Dispatch<SetStateAction<EnhanceOneItemType | null>>
    setIncreaseSubstatObject: React.Dispatch<SetStateAction<ItemSubstatIncrease | null>>
    currentItem: EnhanceOneItemType | null
    currentCurrency: number | null
    setCurrentCurrency: React.Dispatch<SetStateAction<number | null>>
}

const EnhanceForm: React.FC<Props> = (props) => {
    const [expAmount, setExpAmount] = useState<EnhanceItemExp>({ expIncrease: 0 })

    //use effect to change max scroll input amount
    useEffect(() => {
        maxExpForNextLevel();
    }, [props.currentItem])

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        const username = props.username;
        const itemId = props.itemId;

        //enhance substat fetch whenever itemlvl state changes
        if(expAmount.expIncrease === props.remainingExp) {
            const enhanceSubstat = async() => {
                const itemSubstatIncrease = await ItemApi.enhanceSubstat(username!, itemId!);
                if(itemSubstatIncrease) props.setIncreaseSubstatObject(itemSubstatIncrease); 
            };
            enhanceSubstat();
        }
        const result = await ItemApi.enhanceItem(username!, itemId!, expAmount);
        props.setCurrentItem(result);
        setExpAmount({ expIncrease: 0 });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        setExpAmount( previousData => (
            {...previousData, [name]: Number(value)}
        ));
    };

    //max value for the scroll wheel input
    const maxExpForNextLevel = () => {
        const breakPoints = [10, 30, 60, 100];
        if(!props.remainingExp || typeof props.remainingExp === 'string') return 0;
        for(let point of breakPoints) {
            if (props.remainingExp < point) return props.remainingExp;
        };
    }

    return (
        <div>
            <form>
                <div id='form-input' className='flex flex-col'>
                    <label>
                        Enhance EXP Amount: {expAmount.expIncrease}
                    </label>
                    <input type='range' name='expIncrease' min={0} max={maxExpForNextLevel()} step={1} onChange={handleChange}></input>
                </div>
                <div id='submit-button' className='flex flex-col justify-center'>
                    <button type='submit' onClick={handleSubmit}>Enhance!</button>
                </div>
            </form>
        </div>
    )
}

export default EnhanceForm