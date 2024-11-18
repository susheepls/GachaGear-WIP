import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../middleware/UserContext";

interface page {
    name: string,
    href: string,
    key: string
};

const NavBar = () => {
    const { userInfo, fetchUserInfo } = useUser();
    
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const pages: page[] = [
        {name: 'Home', href: '/', key: 'home'},
        {name: 'Inventory', href: userInfo ? `/${userInfo.username}/inventory` : '/login', key: 'inventory'},
        {name: 'Characters', href: '/characters', key: 'characters'},
        {name: 'Get Currency', href: '/currencyBox', key: 'currencybox'},
        {name: 'Roll Now!', href: '/gacharoll', key: 'gacharoll'},
    ];

    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate, token]);

    return (
        <nav>
            <div className="flex bg-three text-white">
                {pages.map((page) => (
                    <a
                        className="p-1 text-whiteblue"
                        key={page.key}
                        href={page.href}
                    >   
                        {page.name}
                    </a>
                ))}
            </div>
        </nav>
    )
}

export default NavBar