import { Link } from "react-router-dom";
import {UserContext} from "./UserProvider.tsx";
import {useContext} from "react";

export default function Header() {
    const { user, logout } = useContext(UserContext)!;
    const userRole = user?.role ?? 'guest';
    const renderUserHeader = () => {
        return (
            <header className="main-header">
                <div className="header-container">
                    <Link to="/" className="logo" aria-label="Home">
                        <img
                            src="https://img.icons8.com/?size=100&id=xQKKgneHmsia&format=png&color=000000"
                            alt="Travel accommodation logo"
                            className="logo-image"
                        />
                        <h1 className="logo-text">
                            Hotels.</h1>
                    </Link>
                    <nav aria-label="Main navigation">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Hotels</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/apartments" className="nav-link">Apartments</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/user" className="nav-link">User Page</Link>
                            </li>
                            <li className="nav-item auth-section">
                                    <button
                                        onClick={logout}
                                        className="btn btn-primary logout-button"
                                        aria-label="Logout"
                                    >
                                        Logout
                                    </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        ); 
    }
    const renderCommonHeader = () => {
        return (
            <header className="main-header">
                <div className="header-container">
                    <Link to="/" className="logo" aria-label="Home">
                        <img
                            src="https://img.icons8.com/?size=100&id=xQKKgneHmsia&format=png&color=000000"
                            alt="Travel accommodation logo"
                            className="logo-image"
                        />
                        <h1 className="logo-text">
                        Hotels.</h1>
                    </Link>
                    <nav aria-label="Main navigation">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Hotels</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/apartments" className="nav-link">Apartments</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">Contact</Link>
                            </li>
                            <li className="nav-item auth-section">
                                {user ? (
                                    <button
                                        onClick={logout}
                                        className="btn btn-primary logout-button"
                                        aria-label="Logout"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn btn-primary login-button"
                                        aria-label="Login"
                                    >
                                        Login
                                    </Link>
                                )}
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
            case "guest":
                return  (
                    <header>
                        {renderCommonHeader()}
                    </header> 
                    )
            case "User":
            default:
                return (
                    <header>
                        {renderUserHeader()}
                    </header>
                );
                
        }
    };
    return renderHeader();
}
