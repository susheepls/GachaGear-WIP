

interface page {
    name: string,
    href: string,
    key: string
};

const NavBar = () => {
    const pages: page[] = [
        {name: 'Home', href: '/', key: 'home'},
        {name: 'Inventory', href: '/', key: 'inventory'},
        {name: 'Roll Now!', href: '/gacharoll', key: 'gacharoll'}
    ];


    return (
        <nav>
            <div>
               {pages.map((page) => (
                    <a
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