import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Button from "../components/Button.tsx";
export default function Signup(){
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5125/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password, userName: userName }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful! You can now login.");
                navigate("/login");
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage("Error registering");
        }
    };

    return (
        <div  className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="input-container">
                    <img
                        src="https://img.icons8.com/?size=100&id=eBEo6FOQZ3v4&format=png&color=000000"
                        alt="Email Icon"
                        className="icon"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Register</button>
            </form>
            <Button name="Back" onClick={() => navigate("/")} />
            <p>{message}</p>
        </div>
    );
}