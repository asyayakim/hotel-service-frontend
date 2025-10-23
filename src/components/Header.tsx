import { Link } from "react-router-dom";
import {UserContext} from "../context/UserProvider.tsx";
import {useContext} from "react";

export default function Header() {
    const { user, logout, loading } = useContext(UserContext)!;
    const userRole = user?.role ?? 'guest';
    if (loading) {
       <header className="main-header">
            <div className="header-container">Loading...</div>
        </header>
    }
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
                        <h1 className="logo-text">Hotels.</h1>
                    </Link>
                    <nav aria-label="Main navigation">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Hotels</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/reservation" className="nav-link">Reservations</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/favorite" className="nav-link">Favorite</Link>
                            </li>
                            <li className="nav-item auth-section">
                                <div className="user-profile-container">
                                    <Link to="/user" className="avatar-link">
                                        {user?.imageUrl ? (
                                            <img
                                                src={user.imageUrl}
                                                alt="User avatar"
                                                className="avatar-overlay"
                                            />
                                        ) : (
                                            <img
                                                src="https://img.icons8.com/?size=100&id=77883&format=png&color=2A4B6F"
                                                alt="Default Avatar"
                                                className="avatar-overlay default-avatar"
                                            />
                                        )}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="btn btn-primary logout-button"
                                        aria-label="Logout"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    };
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
                                <Link to="/favorite" className="nav-link">Favorite</Link>
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
                 
                        renderCommonHeader()
                    );
            case "User":
            default:
                return (
               
                        renderUserHeader()
                 
                );
                
        }
    };
    return renderHeader();
}
