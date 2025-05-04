import {useContext, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import * as React from "react";

export default function UserPage() {
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const {user} = useContext(UserContext)|| {};
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [avatarError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        confirmPassword: "",
    });
    
    const handleUpdateData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.confirmPassword != formData.password) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const customerResponse = await fetch("http://localhost:5003/customer/changeData", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    userId: user?.id,
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : null
                })
            });
            if (customerResponse.ok) {
                alert("Data was changed successfully!.");
            }
        } catch (error) {
            setMessage("Error during update data");
            console.error("Update error:", error);
        }
    };
        const handleUpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file || !file.type.startsWith("image/")) {
                setMessage("Only image files are allowed.");
                return;
            }
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append("image", file);
                formData.append("userId", user?.id);
                
                const customerResponse = await fetch("http://localhost:5003/customer/uploadImage", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${user?.token}`, 
                    },
                    body: formData
                });
                if (customerResponse.ok) {
                    alert("Data was changed!.");
                    const data = await customerResponse.json();
                    console.log(data);
                    setAvatarUrl(data.imageUrl);
                    alert("Avatar updated successfully!");
                }
            } catch (error) {
                setMessage("Error during update data");
                console.error("Update error:", error);
            } finally {
                setLoading(false);
            }
    };
    return (
<main>
        <div className="user-page">
            <h2 className="page-title">Account Settings</h2>
            <div className="user-page-avatar-section">
                <label className="user-page-avatar-label">
                    {avatarUrl || user?.imageUrl ? (
                        <img
                            src={avatarUrl || user.imageUrl}
                            alt="User avatar"
                            className="user-page-avatar-image"
                        />
                    ) : (
                        <img
                            src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000"
                            alt="Default Avatar"
                            className="user-page-default-avatar"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpdateImage}
                        disabled={loading}
                        className="user-page-avatar-input"
                    />
                </label>
                {avatarError && (
                    <div className="user-page-avatar-error">
                        {avatarError}
                    </div>
                )}
            </div>
            <form className="user-form" onSubmit={handleUpdateData}>
                <div className="form-columns">
                    <div className="form-column">
                        <div className="input-container">
                            <img src="https://img.icons8.com/email" alt="Email" className="icon" />
                            <input type="email" placeholder="Email" value={formData.email}
                                   onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/password" alt="Password" className="icon" />
                            <input type="password" placeholder="Password" value={formData.password}
                                   onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/password" alt="Confirm Password" className="icon" />
                            <input type="password" placeholder="Confirm Password" value={formData.confirmPassword}
                                   onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/user" alt="Username" className="icon" />
                            <input type="text" placeholder="Username" value={formData.username}
                                   onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="input-container">
                            <img src="https://img.icons8.com/name-tag" alt="First Name" className="icon" />
                            <input type="text" placeholder="First Name" value={formData.firstName}
                                   onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/name-tag" alt="Last Name" className="icon" />
                            <input type="text" placeholder="Last Name" value={formData.lastName}
                                   onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/phone" alt="Phone Number" className="icon" />
                            <input type="text" placeholder="Phone Number" value={formData.phoneNumber}
                                   onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                        </div>

                        <div className="input-container">
                            <img src="https://img.icons8.com/calendar" alt="Date of Birth" className="icon" />
                            <input type="date" placeholder="Date of Birth" value={formData.dateOfBirth}
                                   onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit" className="change-button">Update</button>
                </div>
            </form>

            {message && <p className="error-message">{message}</p>}
        </div>
</main>
    );
}