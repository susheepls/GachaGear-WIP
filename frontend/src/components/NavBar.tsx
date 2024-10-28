import { useEffect, useState } from "react";
import { AccountInfoType } from "../interface/accountTypes";
import { getAccountFromToken } from "../api/login";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface page {
    name: string,
    href: string,
    key: string
};

const NavBar = () => {
    const [currentUserUrl, setcurrentUserUrl] = useState<string>('/login');
   
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const pages: page[] = [
        {name: 'Home', href: '/', key: 'home'},
        {name: 'Inventory', href: `${currentUserUrl}`, key: 'inventory'},
        {name: 'Roll Now!', href: '/gacharoll', key: 'gacharoll'}
    ];
    
    useEffect(() => {
        if(!token) {
            setcurrentUserUrl('/login');
            return;
        }
        getUserInfoFromToken(navigate);
    }, [token]);

    const getUserInfoFromToken = async(navigate: NavigateFunction) => {
        const userInfo: AccountInfoType | null = await getAccountFromToken(navigate);
        const expectedUrl = `/${userInfo?.username}/inventory`;

        if (userInfo && currentUserUrl !== expectedUrl) {
            setcurrentUserUrl(expectedUrl);
        }
    };

    return (
        <nav>
            <div className="flex">
                {pages.map((page) => (
                    <a
                        className="p-1"
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