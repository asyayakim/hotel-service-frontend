import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button.tsx";

export default function Signup() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        userName: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const authResponse = await fetch("http://localhost:5003/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.userName
                }),
            });

            const authData = await authResponse.json();
            console.log(authData);

            if (!authResponse.ok) {
                setMessage(authData.message || "Registration failed");
                return;
            }
            const customerResponse = await fetch("http://localhost:5003/Customer", {
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
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
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