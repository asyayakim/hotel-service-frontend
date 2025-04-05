import { Link } from "react-router-dom";
import {UserContext} from "./UserProvider.tsx";
import {useContext} from "react";

export default function Header() {
    const { user, logout } = useContext(UserContext)!;
    const userRole = user?.role;
    const renderCommonHeader = () => {
        return (
            <header>
                <div className="header-container">
                    <a href="/" className="logo">
                        <img src="https://img.icons8.com/?size=100&id=xQKKgneHmsia&format=png&color=000000" alt="house icon"/>
                    </a>
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Services</a></li>
                            <li><a href="#">Contact</a></li>
                            <li>
                                {user ? (
                                    <>
                                        <button onClick={logout} className="btn btn-primary">Logout</button>
                                    </>
                                    ) : (
                                <Link to="/login" className="btn btn-primary">Login
                                </Link> )} 
                            </li>
                                    
                        </ul>
                    </nav>
                </div>
            </header>
        );
    };
    const renderHeader = () => {
        switch (userRole) {
            // case "Admin":
            //     return renderAdminHeader();
            case "User":
            default:
                return (
                    <header>
                        {renderCommonHeader()}
                    </header>
                );
        }
    };
    return renderHeader();
}
