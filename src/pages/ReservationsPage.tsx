import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

export const API_BASE_URL = "https://hotelservice-2cw7.onrender.com";

export default function ReservationsPage() {
    type Reservation = {
        reservationId: number;
        reservationDate: string;
        roomId: number;
        customerId: number;
        checkInDate: string;
        checkOutDate: string;
        totalPrice: number;
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        status: string;
        paymentMethodId: number;
        paymentMethod?: {
            cardType: string;
            cardNumber: string;
        };
        adultsCount: number;
    }
    type Review = {
        reviewId: number;
        reservationId: number;
        comment: string;
        rating: number;
        createdAt: Date;
    }
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const {user} = useContext(UserContext)!;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const statusStyles: Record<string, string> = {
        "confirmed": "badge-confirmed",
        "cancelled": "badge-cancelled",
        "pending": "badge-pending",
        "rejected": "badge-rejected",
        "paid": "badge-paid",
        "completed": "badge-completed",

    };
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/review/user/${user?.id}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.token}`},
                });

                if (!response.ok) {
                    const data: Review[] = await response.json();
                    setReviews(data);
                    return;
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        if (user?.id) fetchReviews();
    }, [user?.id]);
    


    const handleLeaveReview = async (reservationId: number) => {
        navigate("/write-review", {
            state: {
                reservationId: reservationId,
            }
        }); 
    }
    
    const handleCancelReservation = async (reservationId: number) => {
        try {
            const result = await Swal.fire({
                title: "Cancel Reservation?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--accent)",
                cancelButtonColor: "var(--border)",
                confirmButtonText: "Yes, cancel it!"
            });

            if (result.isConfirmed) {
                const response = await fetch(
                    `${API_BASE_URL}/reservation/reservation?userId=${user?.id}&reservationId=${reservationId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${user?.token}`
                        },
                    }
                );
                
                if (response.ok) {
                    await Swal.fire("Cancelled!", "Your reservation has been canceled.", "success");
                    setReservations(prev =>
                        prev.map(res =>
                            res.reservationId === reservationId
                                ? { ...res, status: 'cancelled' }
                                : res
                        )
                    );
                } else {
                    throw new Error("Failed to cancel reservation");
                }
            }
        } catch (error) {
            Swal.fire("Error!", error instanceof Error ? error.message : "Cancellation failed", "error");
        }
    }

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchReservation = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/reservation/reservations-by-userId/${user?.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    }
                });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Reservation[] = await response.json();

                console.log("Fetched reservations:", data);
                console.log("Fetched user ID:", user.id);
                setReservations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [user]);
    if (loading) return (
        <div className="loading">
            <div className="cheerful-loader">
                <div className="bounce bounce1"></div>
                <div className="bounce bounce2"></div>
                <div className="bounce bounce3"></div>
            </div>
            <div className="loading-text">Loading reservations...</div>
        </div>
    );
    if (error) return <div className="error">{error}</div>;

    return (
        <main className="">
            <div className="header-text">
            <h1>Your Reservations</h1>
            </div>
            <div className="reservations-container">

            {reservations.length === 0 ? (
                <div className="no-reservations">
                    <div className="no-results-container">
                        <p className="no-results">No reservations found.
                            <img
                                className="no-results-img"
                                src="https://img.icons8.com/?size=100&id=o5o2xsP3V7kK&format=png&color=000000"
                                alt="No results"/>
                        </p>
                    </div>
                    <button className="button-universal" onClick={() => navigate('/')}>Browse Hotels</button>
                </div>
            ) : (
                reservations.map((reservation) => {
              
                    const formattedCheckIn = new Date(reservation.checkInDate + 'T00:00:00Z').toLocaleDateString();
                    const formattedCheckOut = new Date(reservation.checkOutDate + 'T00:00:00Z').toLocaleDateString();
                    const formattedReservationDate = new Date(reservation.reservationDate).toLocaleDateString();
                    const nights = reservation
                        ? Math.ceil(
                            (new Date(reservation.checkOutDate + 'T00:00:00Z').getTime() -
                                new Date(reservation.checkInDate + 'T00:00:00Z').getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                        : 0;
                    const existingReview = reviews.find(
                        review => review.reservationId === reservation.reservationId
                    );

                    return (
                        <div key={reservation.reservationId} className="reservation-card">
                            <div className="reservation-header">
                                <h3>Reservation #{reservation.reservationId}</h3>
                                <span className={`status-badge ${statusStyles[reservation.status.toLowerCase()] || ''}`}>
                                    {reservation.status}
                                </span>
                            </div>

                            <div className="reservation-details">
                                <div className="detail-row">
                                    <span className="detail-label">Dates:</span>
                                    <span>{formattedCheckIn} → {formattedCheckOut} ({nights} nights)</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Booked on:</span>
                                    <span>{formattedReservationDate}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Guests:</span>
                                    <span>
                                        {reservation.adultsCount} adult{reservation.adultsCount !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Total:</span>
                                    <span className="price">${reservation.totalPrice.toLocaleString()}</span>
                                </div>
                                
                                {existingReview && (
                                    <div className="existing-review">
                                        <div className="review-header">
                                            <h4>Your Review</h4>
                                            <div className="review-rating">
                                                <span className="rating">{existingReview.rating}/10</span>
                                            </div>
                                        </div>
                                        {existingReview.comment && (
                                            <p className="review-comment">"{existingReview.comment}"</p>
                                        )}
                                        <small className="review-date">
                                            Reviewed on {new Date(existingReview.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                )}

                                {reservation.paymentMethod && (
                                    <div className="payment-method">
                                        <span>
                                            Paid with: {reservation.paymentMethod.cardType} ending in
                                            {reservation.paymentMethod.cardNumber.slice(-4)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {reservation.status.toLowerCase() !== 'cancelled' &&
                                reservation.status.toLowerCase() !== 'rejected' &&
                                reservation.status.toLowerCase() !== 'completed' && (
                            <button className="button-universal"   onClick={() => handleCancelReservation(reservation.reservationId)}>Cancel order</button>
                                )}


                            {reservation.status.toLowerCase() === 'completed' && !existingReview && (

                                <button
                                    className="button-universal"
                                    onClick={() =>  handleLeaveReview(reservation.reservationId)}>
                                    Write Review
                                </button>
                            )}
                        </div>
                    );
                })
            )}
            </div>
        </main>
    );
}