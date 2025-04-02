export default function Header() {
    return (
        <header>
            <div className="header-container">
                <a href="/" className="logo">Logo</a>
                <nav>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#" className="btn btn-primary">Sign Up</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}