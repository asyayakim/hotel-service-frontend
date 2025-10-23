import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { UserContext } from "../context/UserProvider.tsx";
import Loading from "../components/Loading.tsx";
import Swal from "sweetalert2";
import InputContainer from "../components/InputContainer.tsx";
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
        await new Promise((resolve) => setTimeout(resolve, 100));

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
                <InputContainer
                    iconSrc="https://img.icons8.com/?size=100&id=zxB19VPoVLjK&format=png&color=000000"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
        
                <InputContainer
                    iconSrc="https://img.icons8.com/?size=100&id=14095&format=png&color=000000"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <Button type="submit" name="Login" />
    
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