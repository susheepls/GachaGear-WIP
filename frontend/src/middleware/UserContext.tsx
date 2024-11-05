import { NavigateFunction } from "react-router-dom";
import { AccountInfoType } from "../interface/accountTypes";
import { useState, createContext, useContext } from "react";
import { getAccountFromToken } from "../api/login";

interface UserContextType {
    userInfo: AccountInfoType | null,
    fetchUserInfo: (navigate: NavigateFunction) => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<AccountInfoType | null>(null);

    const fetchUserInfo = async(navigate: NavigateFunction) => {
        const data = await getAccountFromToken(navigate);
        if(data) {
            setUserInfo(data);
        } else {
            navigate('/login');
        }
    };

    return (
        <UserContext.Provider value={{ userInfo, fetchUserInfo }}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error ("useUser must be used within a UserProvider")
    }
    return context;
}