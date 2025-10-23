import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button.tsx";
import Swal from "sweetalert2";
import Loading from "../components/Loading.tsx";
import InputContainer from "../components/InputContainer.tsx";
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
                await Swal.fire({
                    title: "Congratulations!",
                    text: `Welcome aboard, ${formData.firstName}! Your account has been created successfully.`,
                    imageUrl: "https://img.icons8.com/color/452/confetti.png",
                    imageWidth: 200,
                    imageHeight: 200,
                    confirmButtonText: "Go to Login",
                });
                navigate("/login");
            }

        } catch (error) {
            setMessage("Error during registration");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return <Loading message="Creating your account..." />;
    }

    return (
        <div className="login-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <InputContainer
                    iconSrc="https://img.icons8.com/email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <InputContainer
                    iconSrc="https://img.icons8.com/password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <InputContainer
                    iconSrc="https://img.icons8.com/user"
                    placeholder="Username"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                />

                <InputContainer
                    iconSrc="https://img.icons8.com/?size=100&id=11730&format=png&color=000000"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                />

                <InputContainer
                    iconSrc="https://img.icons8.com/?size=100&id=11730&format=png&color=000000"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                />

                <InputContainer
                    iconSrc="https://img.icons8.com/phone"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />

                <InputContainer
                    type="date"
                    iconSrc="https://img.icons8.com/calendar"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    min={formatDate(minDate)}
                    max={formatDate(maxDate)}
                    required
                />
         

                <button type="submit">Register</button>
            </form>
            <Button name="Back" onClick={() => navigate("/")} />
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}