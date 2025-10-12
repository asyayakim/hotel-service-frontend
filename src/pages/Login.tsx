import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { UserContext } from "../components/UserProvider";
import Loading from "../components/Loading.tsx";
import Swal from "sweetalert2";
import { fi } from "date-fns/locale";
export const API_BASE_URL = "https://hotelservice-2cw7.onrender.com";

export default function Login() {
    const { login } = useContext(UserContext)!;
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: userName, password: password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setIsLoading(false);
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
                loyaltyPoints: data.userDto.loyaltyPoints,
                registrationDate: data.userDto.registrationDate,
            };
            login({ user, token: data.token });
            navigate("/");
            // setMessage("Login successful!");
            setTimeout(async () => {
                setIsLoading(false);
                await Swal.fire({
                    title: "Welcome back!",
                    text: `Good to see you again, ${user.username}!`,
                    imageUrl: "https://img.icons8.com/?size=100&id=XiSP6YsZ9SZ0&format=png&color=000000",
                    imageWidth: 48,
                    imageHeight: 48,
                    imageAlt: "Welcome Image",
                    confirmButtonColor: "#3085d6",
                });

                navigate("/");
            }, 1800);
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
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return <Loading message="Logging you in..." />;
    }

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
                <button type="submit">Login</button>
                <div className="forget-password">
                    Forget your <Link to="/login/restorePassword">Password</Link>
                </div>
            </form>
            <p>{message}</p>
            <div className="login-form">
                <Button name="Register" onClick={() => navigate("/signUp")} />
                <Button name="Back" onClick={() => navigate("/")} />
            </div>
        </div>
    );
}