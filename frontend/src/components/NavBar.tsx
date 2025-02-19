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
        {name: 'Get Skins', href: '/currencyBox', key: 'currencybox'},
        {name: 'Get Gear', href: '/gacharoll', key: 'gacharoll'},
        {name: 'Rankings', href: '/rankings', key: 'rankings'},
        {name: 'Getting Started', href: '/gettingstarted', key: 'gettingstarted'}
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
                    height:210 //height of navbar opened
                },
            )
        } else {
            SetIsHamburgerClicked(false);
            gsap.fromTo(hamburgerMenu,
                {
                    height:210
                },
                {
                    height:0
                },
            )
        }
    }

    return (
        <nav>
            <div className="max-h-8 flex justify-between bg-three text-white lg:hidden">
                <a
                    className="p-1 text-four active:bg-two"
                    key={'home'}
                    href={'/'}
                >
                    Home
                </a>
                <svg className="h-6 w-6 ml-1 rounded-md active:bg-two" onClick={handleHamburgerMenu}>
                    <image height={30} width={20} xlinkHref="/burger-menu.svg"></image>
                </svg>
            </div>
            <div id='hamburger' className="h-{50vh} bg-three z-50 absolute top-7 right-0 lg:hidden">
                <div className="w-screen flex flex-col">
                {isHamburgerClicked && pages.map((page) => (
                        <a
                            className="p-1 text-four active:bg-two"
                            key={page.key}
                            href={page.href}
                        >   
                            {page.name}
                        </a>
                ))}
                </div>
            </div>
            <div className="hidden lg:flex justify-start bg-three text-four h-12 text-xl">
                <a
                    className="p-1 text-four active:bg-two my-auto hover:bg-two rounded-md"
                    key={'home'}
                    href={'/'}
                >
                    Home
                </a>
                {pages.map((page) => (
                    <a
                    className="p-1 text-four active:bg-two ml-4 rounded-md hover:bg-two my-auto"
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