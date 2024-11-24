import React from 'react'

const SearchRankings = () => {
    return (
        <div className='mt-2 flex flex-col mx-auto'>
            <div>
                Search Character by Name
            </div>
            <div>
                <input type='text' className=' focus' placeholder='Character Name'></input>
            </div>
            <div className='w-14 mx-auto rounded-xl outline outline-1 text-center m-2'>
                <button>Go</button>
            </div>
        </div>
    )
}

export default SearchRankings