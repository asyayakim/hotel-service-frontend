import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "../components/Button.jsx";
import {UserContext} from "../components/UserProvider";

export default function Login() {
    const {login} = useContext(UserContext)!;
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5003/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userName: userName, password: password}),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || `Login failed: ${response.status}`);
                return;
            }
            const user = {
                id: data.userDto.id,
                username: data.userDto.userName,
                email: data.userDto.email,
                role: data.userDto.role,
                token: data.token,
                imageUrl: data.userDto.imageUrl,
            };
            console.log(user);
            login({ user, token: data.token });
            navigate("/");
            setMessage("Login successful!");
            // if (data.user.role === "Admin") {
            //     navigate("/admin");
            // }
            // else if (data.user.role === "User") {
            //     navigate("/user");
            // }
            // else if (data.user.role === "Employee" ){
            //     navigate("/employee");
            // }
        }
     catch (error) {
        setMessage("Something went wrong. Please try again.");
        console.error(error);
    }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
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
                <div className="forget-password">
                    Forget your <Link to="/login/restorePassword">Password</Link>
                </div>
            </form>
            <p>{message}</p>
            <div className="login-form">
                <Button name="Register" onClick={() => navigate("/signUp")}/>
                <Button name="Back" onClick={() => navigate("/")}/>
            </div>
        </div>
    );
}