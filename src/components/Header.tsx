import { Link } from "react-router-dom";

export default function Header() {
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
                            <li><Link to="/signUp" className="btn btn-primary">Sign Up</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    };

    return renderCommonHeader();
}
