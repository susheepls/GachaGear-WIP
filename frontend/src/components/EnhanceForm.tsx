import React, { FormEvent, SetStateAction, useEffect, useState } from 'react'
import { EnhanceItemExp, ItemSubstatIncrease } from '../interface/itemType'
import * as ItemApi from '../api/item';
import * as CurrencyApi from '../api/currency'
import { EnhanceOneItemType } from '../interface/inventoryType';
import { CurrencyDecreaseRequest, CurrencyDecreaseResponse } from '../interface/currencyTypes';

interface Props{
    remainingExp: number | string | null
    username: string | undefined,
    itemId: string | undefined,
    setCurrentItem: React.Dispatch<SetStateAction<EnhanceOneItemType | null>>
    setIncreaseSubstatObject: React.Dispatch<SetStateAction<ItemSubstatIncrease | null>>
    currentItem: EnhanceOneItemType | null
    currentCurrency: number | null
    setCurrentCurrency: React.Dispatch<SetStateAction<number | null>>
    setSubstatIncreaseHistory: React.Dispatch<SetStateAction<ItemSubstatIncrease[]>>
}

const EnhanceForm: React.FC<Props> = (props) => {
    const [expAmount, setExpAmount] = useState<EnhanceItemExp>({ expIncrease: 0 });
    const [decreaseCurrencyAmount, setDecreaseCurrencyAmount] = useState<CurrencyDecreaseRequest>({ decreaseAmount: 0 });
    const [expStatePlaceholder, setExpStatePlaceholder] = useState<number>(0);

    //use effect to change max scroll input amount
    useEffect(() => {
        maxExpForNextLevel();
    }, [props.currentItem])

    //useEffect to set the placeholder for enhance button
    useEffect(() => {
        if(!props.remainingExp || typeof props.remainingExp === 'string') return;
        setExpStatePlaceholder(props.remainingExp);
    }, [props.remainingExp])

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        const username = props.username;
        const itemId = props.itemId;
        
        //check if account has enough currency then enhance
        if(props.currentCurrency && expAmount.expIncrease !== 0 && expAmount.expIncrease <= props.currentCurrency){
            const result = await ItemApi.enhanceItem(username!, itemId!, expAmount);
            const decreaseCurrencyFetch: CurrencyDecreaseResponse = await CurrencyApi.decreaseAccountCurrency(username!, decreaseCurrencyAmount);

            //make sure to sort the result
            if (result.result?.substats) {
                const substatOrder = ['atk', 'hp', 'def'];
                result.result.substats = [...result.result.substats].sort(
                    (a, b) => substatOrder.indexOf(a.substatType.name) - substatOrder.indexOf(b.substatType.name)
                );
            };
            
            props.setCurrentCurrency(decreaseCurrencyFetch.result.currency);
            props.setCurrentItem(result);
            setExpAmount({ expIncrease: 0 });
            setDecreaseCurrencyAmount({ decreaseAmount: 0 });
        } else if(expAmount.expIncrease === 0){
            return;
        } else {
            alert('Not Enough Currency');
            return;
        }
        
        //enhance substat fetch whenever itemlvl state changes
        if(expAmount.expIncrease === props.remainingExp) {
            const enhanceSubstat = async() => {
                const itemSubstatIncrease = await ItemApi.enhanceSubstat(username!, itemId!);
                if(itemSubstatIncrease) {
                    props.setIncreaseSubstatObject(itemSubstatIncrease);
                    props.setSubstatIncreaseHistory( oldData => ([...oldData, itemSubstatIncrease]) ) 
                }
            };
            enhanceSubstat();
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        setExpAmount( previousData => (
            {...previousData, [name]: Number(value)}
        ));
        //make sure the decrease amount object is also changed
        setDecreaseCurrencyAmount( previousData => (
            {...previousData, decreaseAmount: Number(value)}
        ))
    };

    //max value for the scroll wheel input
    const maxExpForNextLevel = () => {
        const breakPoints = [10, 30, 60, 100];
        if(!props.remainingExp || typeof props.remainingExp === 'string') return 0;
        for(let point of breakPoints) {
            if (props.remainingExp < point) return props.remainingExp;
        };
    }

    //revamped exp increase form to make it simpler (increase and decrease buttons only per level)
    const increaseFormValue = (event: FormEvent) => {
        event.preventDefault();
        //required exp for next level
        const breakPoints = [10, 20, 30, 40];
    
        if(typeof props.remainingExp === 'string' || !props.remainingExp) return;

        let index = breakPoints.indexOf(expStatePlaceholder);

        for(let point of breakPoints){
            if(expStatePlaceholder === point){
                setExpStatePlaceholder(breakPoints[index+1]);
                setExpAmount({ expIncrease: expAmount.expIncrease + point });
                return;
            }       
        }
    }

    const decreaseFormValue = (event: FormEvent) => {
        event.preventDefault();
        const breakPoints = [10, 20, 30, 40];
    
        if(typeof props.remainingExp === 'string' || !props.remainingExp) return;

        let index = breakPoints.indexOf(expStatePlaceholder);

        for(let point of breakPoints){
            if(expStatePlaceholder === point && expStatePlaceholder !== 10){
                setExpStatePlaceholder(breakPoints[index-1]);
                setExpAmount({ expIncrease: expAmount.expIncrease - breakPoints[index-1] });
                return
            } else if(!expStatePlaceholder) {
                setExpStatePlaceholder(breakPoints[3]);
                setExpAmount({ expIncrease: expAmount.expIncrease - breakPoints[3] });   
            }
        }
    }

    return (
        <div className='outline outline-2 outline-five rounded-full p-1 mt-3 lg:w-1/3 lg:mx-auto'>
            <form>
                <div id='form-input' className='flex flex-col'>
                    <label className='text-center'>
                        Enhance EXP Amount: {expAmount.expIncrease}
                    </label>
                    <input id='exp-input' type='number' disabled readOnly name='expIncrease' min={0} max={maxExpForNextLevel()} step={1} onChange={handleChange}></input>
                    <div className='flex justify-evenly'>
                        <div className='w-auto p-1 rounded-md'>
                            <button onClick={increaseFormValue}>Increase</button>
                        </div>
                        <div className='w-auto p-1 rounded-md'>
                            <button onClick={decreaseFormValue}>Decrease</button>
                        </div>
                    </div>
                </div>
                <div id='submit-button' className='flex flex-col justify-center outline outline-1 outline-four bg-five text-four w-24 mx-auto rounded-md active:bg-one transition hover:bg-one'>
                    <button type='submit' onClick={handleSubmit}>Enhance!</button>
                </div>
            </form>
        </div>
    )
}

export default EnhanceForm