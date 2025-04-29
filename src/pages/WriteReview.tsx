import Swal from "sweetalert2";
import {useContext, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import * as React from "react";
import { useLocation } from "react-router-dom";
interface ReservationState {
    reservationId: number;
}
interface ReviewFormData {
    rating: number;
    comment: string;
}
export default function WriteReviewPage() {
    
    const location = useLocation();
    const { user } = useContext(UserContext)!;
    const reservationDetails = location.state as ReservationState;
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 10,
        comment: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!reservationDetails) {
        navigate("/");
        return null;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (!formData.rating) {
                throw new Error("Please select a rating");
            }
        const reviewResponse = await fetch(`http://localhost:5003/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
            },
            body: JSON.stringify({
                UserId: user?.id,
                ReservationId: reservationDetails.reservationId,
                Rating: formData.rating,
                Comment: formData.comment
            })
        });
        if (!reviewResponse.ok) {
            const errorData = await reviewResponse.json();
            throw new Error(errorData.message || "Reservation failed");
        }
        navigate("/")
        await Swal.fire({
            title: "You left a review!",
            text: `Thank for your help to evaluate our hotel.`,
            icon: "success"
        });
        navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
            Swal.fire({
                title: "Error!",
                text: error || "Failed to submit review",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="review-page">
           
            <form onSubmit={handleSubmit} className="review-form">
                <h1>Write a Review</h1>
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        value={formData.rating}
                        onChange={(e) => setFormData({
                            ...formData,
                            rating: Number(e.target.value)
                        })}
                        required
                        disabled={loading}
                    >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                            <option key={num} value={num}>
                                {num} Star{num !== 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comment:</label>
                    <textarea
                        id="comment"
                        value={formData.comment}
                        onChange={(e) => setFormData({
                            ...formData,
                            comment: e.target.value
                        })}
                        rows={4}
                        disabled={loading}
                        maxLength={500}
                        placeholder="Share your experience (optional)"
                    />
                    <small className="character-count">
                        {formData.comment.length}/500 characters
                    </small>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !formData.rating}
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </main>
    );
}