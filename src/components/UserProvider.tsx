// import React, { createContext, useState, useEffect } from "react";
//
// export const UserContext = createContext();
//
// export default function UserProvider({ children }) {
//     const [user, setUser] = useState(null);
//     useEffect(() => {
//         const storedUser = localStorage.getItem("userdata");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser).user);
//         }
//     }, []);
//
//     const login = (userData) => {
//         setUser(userData.user);
//         localStorage.setItem("userdata", JSON.stringify(userData.user));
//         localStorage.setItem("token", userData.token);
//     };
//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem("userdata");
//         localStorage.removeItem("token");
//     };
//     return (
//         <UserContext.Provider value={{ user, login, logout, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// }