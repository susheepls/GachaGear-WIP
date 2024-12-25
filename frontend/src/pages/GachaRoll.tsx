import { useState } from 'react'
import * as gachaRollApi from '../api/gacharoll'
import { Item } from '../interface/inventoryType'
import Cookies from 'js-cookie'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../middleware/UserContext'

const GachaRoll = () => {
  const [newItem, setNewItem] = useState<Item | null>(null);
  const [isAwaitingFlip, setIsAwaitingFlip] = useState<boolean>(true);
  const [isClickedOnce, setIsClickedOnce] = useState<boolean>(false);

  const navigate = useNavigate();

  const { userInfo } = useUser();

  const token = Cookies.get('token');
  const handleRollRequest = async() => {
    if(!token) alert('You must log in to roll!');
    setNewItem(null);
    const rolledItem = await gachaRollApi.rollGacha();
    if(!rolledItem) return;
    setNewItem(rolledItem);

    const itemDiv = document.getElementById('newItem-container');
  
    itemDiv?.classList.add('hidden');
    setIsAwaitingFlip(true);
    setIsClickedOnce(true);
  }

  useGSAP(() => {
    const itemDiv = document.getElementById('newItem');
    if(!itemDiv) return;
    const itemBackDiv = document.getElementById('item-card-back');
    if(!itemBackDiv) return;
    const rollAgainButton = document.getElementById('roll-again-button');
    if(!rollAgainButton) return;

    const awaitingFlipAnimation = gsap.timeline({ repeat: -1 });
    const tl = gsap.timeline();

    if(!isAwaitingFlip) {
      tl.fromTo(itemBackDiv,
        {
          scaleX: 1,
          opacity: 1
        },
        {
          scaleX: 0,
          opacity: 0
        }
      )
      tl.to(itemDiv, { opacity: 1, duration: 0.1 })
      tl.fromTo(itemDiv,
        {
          scaleX: 0,
        },
        {
          scaleX: 1
        }
      )
      tl.fromTo(rollAgainButton,
        {
          opacity: 0
        },
        {
          opacity: 1
        }
      )
    } else {
      gsap.to(itemBackDiv, { scaleX: 1, duration: 0 });
      gsap.to(itemDiv, { opacity: 0, duration: 0 });
      gsap.to(itemDiv, { scaleX: 0, duration: 0 });
      gsap.to(rollAgainButton, { opacity: 0, duration: 0 });
      gsap.to(itemBackDiv, { opacity: 1 });

      awaitingFlipAnimation.fromTo(itemBackDiv, 
        {
          y: -1
        },
        {
          y: 1,
          yoyoEase: true
        }
      )
      awaitingFlipAnimation.fromTo(itemBackDiv,
        {
          y: 1
        },
        {
          y: -1,
          yoyoEase: true
        }
      )
    }

  }, [newItem, isAwaitingFlip])

  const toItemEnhance = (itemId: number) => {
    navigate(`/${userInfo!.username}/inventory/${itemId}`);
  }

  const itemTypeSvgChooser = (itemType: string) => {
    if(itemType === 'sword') return '/sword.svg';
    else if (itemType === 'armor') return '/armor.svg';
    else return '/hat.svg';
  }

  const imageFlipFunction = () => {
    const itemDiv = document.getElementById('newItem-container');
    const rollAgainButton = document.getElementById('roll-again-button');
    if(!itemDiv) return;
    if(!rollAgainButton) return;

    setIsAwaitingFlip(false);
    itemDiv.classList.remove('hidden');
    
  }

  if(isClickedOnce && !newItem) return <div className='text-four w-fit p-1 bg-slate-400 rounded-lg mx-auto animate-pulse'>Loading...</div>;
  
  return (
    <div className='flex-col h-screen'>
      {!newItem ? (
        <div className='flex justify-center'>
            <div className='mx-auto w-11 text-center mt-2 text-four bg-three rounded-lg lg:text-3xl lg:w-fit lg:p-1 lg:mt-12 transition hover:bg-two'>
              <button onClick={() => handleRollRequest()}>Roll!</button>
            </div>
        </div>
      ) : (
        
        <div id='whole-item-div'>
          <div id='item-card-back' className='w-[216] h-[236] mt-2 cursor-pointer' onClick={() => imageFlipFunction()}>
              <div className='w-full h-full'>
                <svg className='w-36 h-36 mx-auto'>
                  <image id='floating-image' className='w-36 h-36' href={itemTypeSvgChooser(newItem.name.name)}></image>
                </svg>
              </div>
          </div>
          <div id='newItem-container' className='hidden w-full absolute top-6 lg:top-14'>
            <div id='newItem' className='flex flex-col mt-4 w-fit px-20 mx-auto'>
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
                  {newItem.substats[0].substatType.name}
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
            <div id='roll-again-button' className='items-center'>
              <div className='p-1 w-fit mx-auto bg-five text-four rounded-lg active:bg-two transition hover:bg-two hover:scale-110'>
                <button onClick={() => toItemEnhance(newItem.id)}>
                  Enhance Now!
                </button>
              </div>
              <div className='p-1 w-fit mx-auto bg-three text-four rounded-lg active:bg-two mt-2 transition hover:bg-two hover:scale-110'>
                <button onClick={() => handleRollRequest()}>
                  Roll Again!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default GachaRoll