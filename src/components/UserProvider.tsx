import {createContext, useState, useEffect, ReactNode} from "react";

type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    token: string;
    imageUrl?: string;
    loyaltyPoints: number;
};

type UserContextType = {
    user: User | null;
    login: (userData: { user: User; token: string }) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);
type Props = {
    children: ReactNode;
};
export default function UserProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("userdata");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            // setUser(JSON.parse(storedUser).user);
        }
    }, []);

    const login = (userData: { user: User; token: string }) => {
        setUser(userData.user);
        localStorage.setItem("userdata", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userdata");
        localStorage.removeItem("token");
    };
    return (
        <UserContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
}