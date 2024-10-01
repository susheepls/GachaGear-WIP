// import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const routeChange = () => {
        navigate('/login')
    }

    return (
        <div>
            <button onClick={() => routeChange()}>Click Here to Login!</button>
        </div>
    )
}

export default Home