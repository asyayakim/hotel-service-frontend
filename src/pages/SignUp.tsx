import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button.tsx";
export const API_BASE_URL = "https://hotelservice-2cw7.onrender.com";

export default function Signup() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: ""
    });
    const today = new Date();
    const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
    );
    const maxDate = today;

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setMessage("");
        try {
            const authResponse = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.userName
                }),
            });

            const authData = await authResponse.json();

            if (!authResponse.ok) {
                setMessage(authData.message || "Registration failed");
                return;
            }
            const customerResponse = await fetch(`${API_BASE_URL}/Customer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: Number(authData),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth
                })
            });
            if (customerResponse.ok) {
                alert("Registration successful! You can now login.");
                navigate("/login");
            }

        } catch (error) {
            setMessage("Error during registration");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="input-container">
                    <img
                        src="https://img.icons8.com/email"
                        alt="Email"
                        className="icon"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="input-container">
                    <img
                        src="https://img.icons8.com/password"
                        alt="Password"
                        className="icon"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div className="input-container">
                    <img
                        src="https://img.icons8.com/user"
                        alt="User"
                        className="icon"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        required
                    />
                </div>

                <div className="input-container">
                    <img
                        src="https://img.icons8.com/?size=100&id=11730&format=png&color=000000"
                        alt="First Name"
                        className="icon"
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                </div>

                <div className="input-container">
                    <img
                        src="https://img.icons8.com/?size=100&id=11730&format=png&color=000000"
                        alt="Last Name"
                        className="icon"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>

                <div className="input-container">
                    <img
                        src="https://img.icons8.com/phone"
                        alt="Phone"
                        className="icon"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                    />
                </div>

                <div className="input-container">
                    <img
                        src="https://img.icons8.com/calendar"
                        alt="Birthdate"
                        className="icon"
                    />
                    <input
                        type="date"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        min={formatDate(minDate)}
                        max={formatDate(maxDate)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>
            <Button name="Back" onClick={() => navigate("/")} />
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}