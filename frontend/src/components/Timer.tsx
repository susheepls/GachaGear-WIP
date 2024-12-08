import React, { SetStateAction, useEffect, useState } from 'react'

interface Props {
    lastOpenTime: Date | null,
    setTimerComplete: React.Dispatch<SetStateAction<boolean>>,
    timerComplete: boolean
}

const Timer: React.FC<Props> = (props) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [deadline, setDeadline] = useState<Date | null>(null);
    
    //use effect to determine deadline after we fetch if we can open the box
    useEffect(() => {
        determineDeadline()
    }, [props.lastOpenTime]);

    //use effect to enable the count down timer
    useEffect(() => {
        if(props.timerComplete === false){
            const interval = setInterval(() => getTime(deadline), 1000);
            return () => clearInterval(interval);
        } else {
            setDeadline(null);
        }
    }, [deadline, props.timerComplete])

    //determine the deadline which would be one day from the date last opened
    const determineDeadline = () => {
        if(props.lastOpenTime && ((props.lastOpenTime.getTime() + (60000 * 60 * 24)) - Date.now()) > 0 ){
            props.setTimerComplete(false);
            setDeadline(new Date(props.lastOpenTime.getTime() + (60000 * 60 * 24)));
        } else {
            setDeadline(null);
            props.setTimerComplete(true);
        }
    }
    
    //the actually timer function to determine the days,hours, etc
    const getTime = (deadline: Date | null) => {
        if(deadline){
            const time = deadline.getTime() - Date.now();
            
            setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
            setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((time / 1000 / 60) % 60));
            setSeconds(Math.floor((time / 1000) % 60));
            if(time <= 0) {
                props.setTimerComplete(true);
                setDays(0);
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            }
        
        } else {
            props.setTimerComplete(true);
        }
    }

    return (
        <div id='timer' className='flex justify-center bg-three rounded-md mt-1'>
            <div id='days' className='p-1 bg-four m-1 rounded-lg'>
                {days} Days
            </div>
            <div id='hours' className='p-1 bg-four m-1 rounded-lg'>
                {hours} hours
            </div>
            <div id='minutes' className='p-1 bg-four m-1 rounded-lg'>
                {minutes} minutes
            </div>
            <div id='seconds' className='p-1 bg-four m-1 rounded-lg'>
                {seconds} seconds
            </div>
        </div>
    )
}

export default Timer