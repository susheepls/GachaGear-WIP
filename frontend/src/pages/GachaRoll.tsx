import { useState } from 'react'
import * as gachaRollApi from '../api/gacharoll'
import { Item } from '../interface/inventoryType'
import Cookies from 'js-cookie'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const GachaRoll = () => {
  const [newItem, setNewItem] = useState<Item | null>(null);
  const token = Cookies.get('token');
  const handleRollRequest = async() => {
    if(!token) alert('You must log in to roll!');
    const rolledItem = await gachaRollApi.rollGacha();
    if(!rolledItem) return;
    setNewItem(rolledItem);
  }

  useGSAP(() => {
    const itemDiv = document.getElementById('newItem');
    if(!itemDiv) return;

    gsap.fromTo(itemDiv,
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    )

  }, [newItem])

  const itemTypeSvgChooser = (itemType: string) => {
    if(itemType === 'sword') return '/sword.svg';
    else if (itemType === 'armor') return '/armor.svg';
    else return '/hat.svg';
}

  return (
    <div className='flex-col'>
      {!newItem ? (
        <div className='flex justify-center'>
            <div className='mx-auto w-11 text-center mt-2 text-four bg-three rounded-lg'>
              <button onClick={() => handleRollRequest()}>Roll!</button>
            </div>
        </div>
      ) : (
        <div id='whole-item-div'>
          <div id='newItem' className='flex flex-col mt-4'>
            <div className='w-14 flex flex-col mx-auto p-1 text-four bg-three rounded-lg'>
              <div className='w-fit mx-auto'>
                {String(newItem.name.name)}
              </div>
              <div className='w-4 h-4 mx-auto'>
                <svg className='w-4 h-4'>
                  <image href={itemTypeSvgChooser(newItem.name.name)}></image>
                </svg>
              </div>
            </div>
            <div className='w-14 mx-auto mt-2 mb-3 outline outline-1 outline-three text-center'>
              <div>
                <div>
                  {newItem.substats[0].substatType.name}
                </div>
                <div className='w-fit h-fit'>

                </div>
              </div>
              <div>
                {newItem.substats[0].value}
              </div>
            </div>
            <div className='w-14 mx-auto mb-3 outline outline-1 outline-three text-center'>
              <div>
                {newItem.substats[1].substatType.name}
              </div>
              <div>
                {newItem.substats[1].value}
              </div>
            </div>
            <div className='w-14 mx-auto mb-3 outline outline-1 outline-three text-center'>
              <div>
                {newItem.substats[2].substatType.name}
              </div>
              <div>
                {newItem.substats[2].value}
              </div>
            </div>
          </div>
          <div className='p-1 w-fit mx-auto bg-three text-four rounded-lg active:bg-two mt-3'>
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