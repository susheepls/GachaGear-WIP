import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CaseOpeningAnimation = () => {
    const itemsContainerRef = useRef(null);

    const items = [
        'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 
        'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10',
    ];

    const displayItems = [...items, ...items];

    useEffect(() => {
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

        return () => {
            clearTimeout(stopTimeout);
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
    }

    return (
        <div className="relative overflow-hidden w-[300px] h-[100px] border">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-2 h-full bg-red-500 z-10"></div>
            <div ref={itemsContainerRef} className="flex gap-7">
                {shuffleArray(displayItems).map((item, index) => (
                    <div key={index} className="w-24 h-[100px] bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseOpeningAnimation;