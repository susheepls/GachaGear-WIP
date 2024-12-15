import { SetStateAction, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SkinCaseData } from '../interface/CaseTypes';
import * as SkinApi from '../api/skin';

interface Props {
    setSkinWon: React.Dispatch<SetStateAction<SkinCaseData | null>>
    setIsOpeningSkinCase: React.Dispatch<SetStateAction<boolean>>
    username: string
}

const items = [
    'common', 'common', 'common', 'common', 'common', 
    'common', 'rare', 'rare', 'rare', 'epic',
];


const SkinOpeningAnimation: React.FC<Props> = (props) => {
    const itemsContainerRef = useRef(null);
    const [skinApiResult, setSkinApiResult] = useState<SkinCaseData | null>(null);
    const [displayItems, setDisplayItems] = useState<string[]>(shuffleArray([...items, ...items, ...items]));
    
    const hasFetched = useRef(false);

    useEffect(() => {
        if(hasFetched.current) return;
        hasFetched.current = true;
        
        getWinningSkin();
    }, []);

    const getWinningSkin = async() => {
        const skinWon = await SkinApi.rollSkinCase(props.username);
        if(!skinWon) return;
        
        setSkinApiResult(skinWon);
    }

    useEffect(() => {
        if(!skinApiResult) return;

        const arrayCopy = [...displayItems]
        arrayCopy[28] = skinApiResult.rarity.name;
        setDisplayItems(arrayCopy);

    }, [skinApiResult])
    
    useEffect(() => {
        const container = itemsContainerRef.current;
        if(!container) return;

        if(!skinApiResult) return;

        const itemWidth = 96; // Width of each item
        const gap = 28
        const totalItemWidth = itemWidth + gap;
        const totalWidth = displayItems.length * totalItemWidth

        const tl = gsap.timeline();

        tl.to(container, {
            x: `-${totalWidth}`,
            duration: 5,
            ease: 'linear',
            
        });

        const stopTimeout = setTimeout(() => {
            tl.pause();
            gsap.to(container, {
                x: `-=${totalWidth / 9}`, // Adjust to make it slow down to half width further
                duration: 4 , // Longer duration for a smooth stop
                ease: 'power3.out', // Ease out for a gradual stop
                onComplete: () => {
                    props.setSkinWon(skinApiResult);
                }
            });
        }, 4000);

        // const determineWinningAmount = setTimeout(() => {
        //     const winner = document.getElementById('roulette');
        //     if(!winner) return;
        //     const winningSkin = (winner?.children[28] as HTMLElement).dataset.item;
        //     props.setSkinWon(previousSkinWon => {
        //         if(!winningSkin) return null;
        //         //adding a space if to make sure it knows winnin 2x same is considered
        //         return previousSkinWon === winningSkin ? `${winningSkin} ` : winningSkin; 
        //     });
        // }, 7000);

        const exitTheCaseScreen = setTimeout(() => {
            gsap.to(container, {
                scale: 0,
                duration: 2.5,
                ease: 'power1.inOut',
                onComplete: () => {
                    props.setIsOpeningSkinCase(false);
                }
            })
        }, 11000);

        const dimRedLine = setTimeout(() => {
            const redline = document.getElementById('prize-line');
            gsap.to(redline, {
                duration: 1.5,
                opacity: 0
            })
        }, 11000)
        
        console.log('running!', displayItems[28], skinApiResult, document.getElementById('28svg'))

        return () => {
            clearTimeout(stopTimeout);
            // clearTimeout(determineWinningAmount);
            clearTimeout(exitTheCaseScreen);
            clearTimeout(dimRedLine);
            tl.kill();
        }

    }, [displayItems]);

    function shuffleArray(array: string[]) {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    function rarityFromcolor(rarity: string) {
        const rarityColors: { [key:string]: string } = {
            'common': 'bg-green-200',
            'rare': 'bg-blue-200',
            'epic': 'bg-purple-600',
        };
        return rarityColors[rarity] || 'bg-yellow-400'
    }

    const randomSVGChooser = (index: number) => {
        if(index !== 28) {
            const choices = ["/hat.svg", "/armor.svg", "/sword.svg"];
            const randomIndex = Math.floor(Math.random() * 3);
            return choices[randomIndex];
        } else {
            return '/' + skinApiResult?.itemName.name + '.svg';
        }
    }

    const itemspluh = displayItems.map((item, index) => 
        <div data-item={item} key={index} className={`w-24 h-[100px] ${rarityFromcolor(item)} flex flex-col items-center justify-center flex-shrink-0`}>
            <div>
                {item}
            </div>
            <svg className='w-4 h-4'>
                <image id={index+'svg'} href={randomSVGChooser(index)}></image>
            </svg>
        </div>
    )

    return (
        <div id='animation' className="relative w-[300px] h-[100px] mt-3">
            <div id='prize-line' className="absolute left-1/2 top-0 transform -translate-x-1/2 w-2 h-full bg-red-500 z-10"></div>
            <div id='roulette' ref={itemsContainerRef} className="flex gap-7 will-change-transform">
                {itemspluh}
            </div>
        </div>
    );
};

export default SkinOpeningAnimation;