import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <section>
            <NavBar/>
            <Outlet/>
        </section>
    )
}

export default Layout