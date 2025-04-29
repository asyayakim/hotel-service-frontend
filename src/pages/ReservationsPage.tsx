import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

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
        "paid": "badge-paid"

    };
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
                    `http://localhost:5003/reservation/reservation?userId=${user?.id}&reservationId=${reservationId}`,
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
                const response = await fetch(`http://localhost:5003/reservation/reservations-by-userId/${user?.id}`, {
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
                console.log(data);

                setReservations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [user]);

    if (loading) return <div className="loading">Loading hotel details...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <main className="reservations-container">
            <h1>Your Reservations</h1>

            {reservations.length === 0 ? (
                <div className="no-reservations">
                    <p>No reservations found</p>
                    <button onClick={() => navigate('/hotels')}>Browse Hotels</button>
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
                                reservation.status.toLowerCase() !== 'rejected' && (
                            <button className="button-universal"   onClick={() => handleCancelReservation(reservation.reservationId)}>Cancel order</button>
                                )}
                        </div>
                    );
                })
            )}
        </main>
    );
}