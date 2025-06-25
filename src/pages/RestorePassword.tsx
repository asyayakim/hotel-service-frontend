import { useNavigate} from "react-router-dom";
import Button from "../components/Button.tsx";
import {useState} from "react";
export const API_BASE_URL = "https://hotelservice-1.onrender.com";

export default function RestorePassword(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5003/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userName: userName, password: password}),
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.message || `Failed: ${response.status}`);
            return;
        }
        navigate("/");
        setMessage("Login successful!");
    }
    
            return (
                <div className="login-container">
                    <h2>Restart your password</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-container">
                            <img
                                src="https://img.icons8.com/?size=100&id=zxB19VPoVLjK&format=png&color=000000"
                                alt="Username Icon"
                                className="icon"
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <img
                                src="https://img.icons8.com/?size=100&id=14095&format=png&color=000000"
                                alt="Password Icon"
                                className="icon"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" onClick={() => navigate("/")}>Login</button>
                    </form>
                    <p>{message}</p>
                    <div className="login-form">
                        <Button name="Register" onClick={() => navigate("/signUp")}/>
                        <Button name="Back" onClick={() => navigate("/")}/>
                    </div>
                </div>
            );
}