import { useState } from 'react'
import * as gachaRollApi from '../api/gacharoll'
import { Item } from '../interface/inventoryType'
import Cookies from 'js-cookie'

const GachaRoll = () => {
  const [newItem, setNewItem] = useState<Item | null>(null);
  const token = Cookies.get('token');
  const handleRollRequest = async() => {
    if(!token) alert('You must log in to roll!');
    const rolledItem = await gachaRollApi.rollGacha();
    if(!rolledItem) return;
    setNewItem(rolledItem);
  }

  return (
    <div className='flex-col'>
      {!newItem ? (
        <div className='flex justify-center'>
            <div className='mx-auto w-11 outline outline-1 text-center mt-2 text-four bg-three rounded-lg'>
              <button onClick={() => handleRollRequest()}>Roll!</button>
            </div>
        </div>
      ) : (
        <div>
          <div id='newItem' className='flex flex-col text-center'>
            <div>
              {String(newItem.name.name)}
            </div>
            <div>
              {newItem.substats[0].substatType.name}
            </div>
            <div>
              {newItem.substats[0].value}
            </div>
            <div>
              {newItem.substats[1].substatType.name}
            </div>
            <div>
              {newItem.substats[1].value}
            </div>
            <div>
              {newItem.substats[2].substatType.name}
            </div>
            <div>
              {newItem.substats[2].value}
            </div>
          </div>
          <div>
            <button onClick={() => handleRollRequest()}>
              Roll Again!
            </button>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default GachaRoll