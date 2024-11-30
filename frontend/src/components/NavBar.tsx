import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../middleware/UserContext";
import gsap from "gsap";

interface page {
    name: string,
    href: string,
    key: string
};

const NavBar = () => {
    const { userInfo, fetchUserInfo } = useUser();
    const [isHamburgerClicked, SetIsHamburgerClicked] = useState<boolean>(false);
    
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const pages: page[] = [
        {name: 'Inventory', href: userInfo ? `/${userInfo.username}/inventory` : '/login', key: 'inventory'},
        {name: 'Characters', href: '/characters', key: 'characters'},
        {name: 'Get Currency', href: '/currencyBox', key: 'currencybox'},
        {name: 'Roll Now!', href: '/gacharoll', key: 'gacharoll'},
        {name: 'Rankings', href: '/rankings', key: 'rankings'},
    ];

    useEffect(() => {
        // Fetch user info only if there's a token and userInfo hasn't been set yet
        if(!userInfo && token) {
            fetchUserInfo(navigate);
        }
    }, [userInfo, fetchUserInfo, navigate, token]);

    const handleHamburgerMenu = () => {
        const hamburgerMenu = document.getElementById('hamburger');

        if(!isHamburgerClicked) {
            SetIsHamburgerClicked(true);
            gsap.fromTo(hamburgerMenu,
                {
                    height:0
                },
                {
                    height:170 //height of navbar opened
                },
            )
        } else {
            SetIsHamburgerClicked(false);
            gsap.fromTo(hamburgerMenu,
                {
                    height:170
                },
                {
                    height:0
                },
            )
        }
    }

    return (
        <nav>
            <div className="max-h-8 flex justify-between bg-three text-white">
                <a
                    className="p-1 text-four"
                    key={'home'}
                    href={'/'}
                >
                    Home
                </a>
                <svg className="h-6 w-6 mr-1" onClick={handleHamburgerMenu}>
                    <image height={30} width={20} href="burger-menu.svg"></image>
                </svg>
            </div>
            <div id='hamburger' className="h-{50vh} bg-three z-50 absolute top-7 right-0">
                <div className="w-screen flex flex-col">
                {isHamburgerClicked && pages.map((page) => (
                        <a
                            className="p-1 text-four"
                            key={page.key}
                            href={page.href}
                        >   
                            {page.name}
                        </a>
                ))}
                </div>
            </div>
        </nav>
    )
}

export default NavBar