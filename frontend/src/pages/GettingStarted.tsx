import { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useUser } from '../middleware/UserContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GettingStarted = () => {
    const token = Cookies.get('token');

    const { userInfo, fetchUserInfo } = useUser();

    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            return
        }
    }, [userInfo, fetchUserInfo, token]);

    useGSAP(() => {
        const introContainer = document.getElementById('whole-intro-container');
        if(!introContainer) return;

        const appflowContainer = document.getElementById('whole-appflow-container');
        if(!appflowContainer) return;

        const additionalNotesContainer = document.getElementById('additonal-notes-container');
        if(!additionalNotesContainer) return;

        gsap.fromTo(introContainer, 
            {
                opacity: 0,
                y: -20
            },
            {
                opacity: 1,
                y:0
            }
        )
        gsap.fromTo(appflowContainer,
            {
                opacity: 0,
                y: -20
            },
            {
                opacity: 1,
                y: 0,
                delay: 1
            }
        )
        gsap.fromTo(additionalNotesContainer,
            {
                opacity: 0,
                y: -20
            },
            {
                opacity: 1,
                y: 0,
                delay: 2
            }
        )
    }, [])

    return (
        <div>
            <div className='w-36 p-1 mx-auto mt-1 font-bold text-xl text-four bg-three rounded-md text-center'>
                Tutorial
            </div>
            <div id='whole-intro-container' className='lg:w-96 lg:mx-auto'>
                <div className='w-fit p-1 mx-auto mt-2 font-bold text-base text-four bg-five rounded-md'>
                    Introduction
                </div>
                <div id='app-introduction' className=' mt-3 outline outline-1 outline-three mx-1'>
                    <div className='p-1'>
                        <div>
                            <p>
                                Hello! Welcome to my personal project! 
                            </p>
                        </div>
                        <div className='mt-1'>
                            <p>
                                I have always been a fan of Gacha games, so I made an app to simulate the 
                                gambling and substat increase found in games like <b>Genshin Impact</b> and <b>Epic Seven</b>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div id='whole-appflow-container'>
                <div className='w-fit p-1 mx-auto mt-3 font-bold text-base text-four bg-one rounded-md'>
                    App Flow
                </div>
                <div id='gameplay-flow' className='mt-3 outline outline-1 outline-three mx-1 p-1 lg:w-fit lg:mx-auto'>
                    <div className='w-fit mx-auto border-b-2 border-one'>
                        Steps
                    </div>
                    <div className='lg:w-fit lg:mx-auto'>
                        <ol className='list-decimal list-inside'>
                            <li>Obtain gear from <span className='text-five'><a href='/gacharoll'>Get Gear</a></span> tab</li>
                            <li>Check <span className='text-five'><a href={`${userInfo?.username}/inventory`}>inventory</a></span> to see the newly acquired item</li>
                            <li>Tap the gear and head to the enhance page!</li>
                            <li>Enhance gear w/ currency to see substat increase</li>
                            <li>Equip gear to character in the <span className='text-five'><a href={`/characters`}>character</a></span> page</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div id='additonal-notes-container' className='mt-3 mb-2'>
                <div className='w-fit p-1 mx-auto font-bold text-base text-four bg-two rounded-md'>
                    Additional Notes
                </div>
                <div className='mt-3 outline outline-1 outline-three mx-1 p-1 lg:w-96 lg:mx-auto'>
                    <div id='substat-rates-container' className='mt-1'>
                        <div className='w-fit p-1 bg-two text-four mx-auto rounded-md'>
                            Substat Rates
                        </div>
                        <div className='flex justify-between mt-2 lg:justify-around'>
                            <div className='w-28 outline outline-1 outline-three'>
                                <div className='w-fit mx-auto border-b-2 border-two'>
                                    Attack
                                </div>
                                <div>
                                    <div className='flex'>
                                        <div>
                                            50-100
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            20%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            101-200
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            60%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            201-300
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            19.5%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            400
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            0.5%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-28 outline outline-1 outline-three'>
                                <div className='w-fit mx-auto border-b-2 border-two'>
                                    Defense
                                </div>
                                <div>
                                    <div className='flex'>
                                        <div>
                                            10-15
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            20%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            16-20
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            60%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            21-25
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            19.5%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            40
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            0.5%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-28 outline outline-1 outline-three'>
                                <div className='w-fit mx-auto border-b-2 border-two'>
                                    HP
                                </div>
                                <div>
                                    <div className='flex'>
                                        <div>
                                            20-30
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            20%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            31-40
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            60%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            41-50
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            19.5%
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            80
                                        </div>
                                        <div className='ml-auto font-bold'>
                                            0.5%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='w-fit mx-auto p-1 bg-two text-four rounded-md mt-3'>
                            How to get Currency
                        </div>
                        <div className='lg:w-fit lg:mx-auto'>
                            <div>
                                You start with 1000, but you can obtain through various methods.
                            </div>
                            <div>
                                <ol className='list-decimal list-inside'> 
                                    <li>Daily Box</li>
                                    <li>Gamble 50 for chance to get more (+60%)</li>
                                    <li>Enhance and sell any gear afterwards</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='w-fit mx-auto p-1 bg-two text-four rounded-md mt-3'>
                            Future Additions
                        </div>
                        <div className='w-fit mx-auto'>
                            <div>
                                Personal character sprites!
                            </div>
                            <div>
                                Rolling for equipment skins!
                            </div>
                            <div className='font-bold'>
                                and more...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GettingStarted