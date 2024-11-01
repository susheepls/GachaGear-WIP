import { SetStateAction, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Props {
    setWinningAmount: React.Dispatch<SetStateAction<string | null>>
    setIsOpeningCase: React.Dispatch<SetStateAction<boolean>>
}

const items = [
    '20 Currency', '20 Currency', '30 Currency', '30 Currency', '50 Currency', 
    '60 Currency', '70 Currency', '70 Currency', '100 Currency', '150 Currency',
];

const CaseOpeningAnimation: React.FC<Props> = (props) => {
    const itemsContainerRef = useRef(null);
    const [displayItems, setDisplayItems] = useState<string[]>([]);

    useEffect(() => {
        setDisplayItems(shuffleArray([...items, ...items]));

        const container = itemsContainerRef.current;
        const itemWidth = 96; // Width of each item
        const gap = 28
        const totalItemWidth = itemWidth + gap;
        const totalWidth = items.length * totalItemWidth

        const tl = gsap.timeline({ repeat: -1 });

        tl.to(container, {
            x: `-=${totalWidth}`,
            duration: 1.8,
            ease: 'linear',
            
        });

        const stopTimeout = setTimeout(() => {
            tl.pause();
            gsap.to(container, {
                x: `-=${totalWidth / 2}`, // Adjust to make it slow down to half width further
                duration: 4 , // Longer duration for a smooth stop
                ease: 'power3.out', // Ease out for a gradual stop
            });
        }, 4000);

        const determineWinningAmount = setTimeout(() => {
            const winner = document.getElementById('roulette');
            if(!winner) return;
            const winningAmount = winner?.children[8].id.split(' ')[0];
            props.setWinningAmount(previousWinAmount => {
                //adding a space if to make sure it knows winnin 2x same is considered
                return previousWinAmount === winningAmount ? `${winningAmount} ` : winningAmount; 
            });
        }, 7000);

        const exitTheCaseScreen = setTimeout(() => {
            gsap.to(container, {
                scale: 0,
                duration: 2.5,
                ease: 'power1.inOut',
                onComplete: () => props.setIsOpeningCase(false),
            })
        }, 11000);

        return () => {
            clearTimeout(stopTimeout);
            clearTimeout(determineWinningAmount);
            clearTimeout(exitTheCaseScreen);
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

    return (
        <div id='animation' className="relative w-[300px] h-[100px] border">
            <div id='prize-line' className="absolute left-1/2 top-0 transform -translate-x-1/2 w-2 h-full bg-red-500 z-10"></div>
            <div id='roulette' ref={itemsContainerRef} className="flex gap-7">
                {displayItems.map((item, index) => (
                    <div id={item} key={index} className="w-24 h-[100px] bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseOpeningAnimation;