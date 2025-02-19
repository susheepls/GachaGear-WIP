import { SetStateAction, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import Chooser from 'random-seed-weighted-chooser';
import { ChosenCurrencyCasePool } from '../interface/CaseTypes';

interface Props {
    setWinningAmount: React.Dispatch<SetStateAction<string | null>>
    setIsOpeningCase: React.Dispatch<SetStateAction<boolean>>
}

const items = [
    '20 Currency', '20 Currency', '30 Currency', '30 Currency', '50 Currency', 
    '60 Currency', '70 Currency', '70 Currency', '50 Currency', '150 Currency',
];

const items2 = [
    '20 Currency', '20 Currency', '20 Currency', '20 Currency', '20 Currency', 
    '20 Currency', '20 Currency', '20 Currency', '20 Currency', '1000 Currency',
];

const weightedArrayChooser = () => {
    const weightedArrays = [
        { value: items, weight: 9},
        { value: items2, weight: 1}
    ]
    const chosenArray = Chooser.chooseWeightedObject(weightedArrays) as ChosenCurrencyCasePool;
    return chosenArray.value;
}

const CaseOpeningAnimation: React.FC<Props> = (props) => {
    const itemsContainerRef = useRef(null);
    const chosenCurrencyPool = weightedArrayChooser();
    const displayItems = useMemo(() => shuffleArray([...chosenCurrencyPool,...chosenCurrencyPool,...chosenCurrencyPool]), []);
    
    useEffect(() => {
        const container = itemsContainerRef.current;
        if(!container) return;

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
            });
        }, 4000);

        const determineWinningAmount = setTimeout(() => {
            const winner = document.getElementById('roulette');
            if(!winner) return;
            const winningAmount = (winner?.children[28] as HTMLElement).dataset.item?.split(' ')[0];
            props.setWinningAmount(previousWinAmount => {
                if(!winningAmount) return null;
                //adding a space if to make sure it knows winnin 2x same is considered
                return previousWinAmount === winningAmount ? `${winningAmount} ` : winningAmount; 
            });
        }, 7000);

        const exitTheCaseScreen = setTimeout(() => {
            gsap.to(container, {
                scale: 0,
                duration: 2.5,
                ease: 'power1.inOut',
                onComplete: () => {
                    props.setIsOpeningCase(false);
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

        return () => {
            clearTimeout(stopTimeout);
            clearTimeout(determineWinningAmount);
            clearTimeout(exitTheCaseScreen);
            clearTimeout(dimRedLine);
            tl.kill();
        }
    }, []);

    function shuffleArray(array: string[]) {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    function rarityFromcolor(currencyAmount: string) {
        const rarityColors: { [key:string]: string } = {
            '20 Currency': 'bg-green-200',
            '30 Currency': 'bg-green-200',
            '50 Currency': 'bg-blue-200',
            '60 Currency': 'bg-purple-600',
            '70 Currency': 'bg-purple-600'
        };
        return rarityColors[currencyAmount] || 'bg-yellow-400'
    }

    const itemspluh = displayItems.map((item, index) => 
        <div data-item={item} key={index} className={`w-24 h-[100px] ${rarityFromcolor(item)} flex items-center justify-center flex-shrink-0`}>
            {item}
        </div>
    )

    return (
        <div id='animation' className="relative w-[300px] h-[100px] mt-3 lg:mx-auto">
            <div id='prize-line' className="absolute left-1/2 top-0 transform -translate-x-1/2 w-2 h-full bg-red-500 z-10"></div>
            <div id='roulette' ref={itemsContainerRef} className="flex gap-7 will-change-transform">
                {itemspluh}
            </div>
        </div>
    );
};

export default CaseOpeningAnimation;