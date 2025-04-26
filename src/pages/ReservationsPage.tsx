import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
export default function ReservationsPage() {
    type Reservation = {
        reservationId: number;
        reservationDate: string;
        roomId: number;
        customerId: number;
        checkInDate: string;
        checkOutDate: string;
        totalPrice: number;
        status: string;
        paymentMethodId: number;
        paymentMethod?: {
            cardType: string;
            cardNumber: string;
        };
        adultsCount: number;
    }
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const {user} = useContext(UserContext)!;
    const {id} = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const formattedCheckIn = reservation ? new Date(reservation.checkInDate).toLocaleDateString() : "";
    const formattedCheckOut = reservation ? new Date(reservation.checkOutDate).toLocaleDateString() : "";
    const formattedReservationDate = reservation ? new Date(reservation.reservationDate).toLocaleDateString() : "";

    const nights = reservation
        ? Math.ceil((new Date(reservation.checkOutDate).getTime() - new Date(reservation.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const statusStyles: Record<string, string> = {
        "confirmed": "badge-confirmed",
        "cancelled": "badge-cancelled",
        "pending": "badge-pending"
    };

    useEffect(() => {
        const fetchReservation = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:5003/api/reservation/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    }
                });
                const data: Reservation = await response.json();
                setReservation(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReservation();
        }
    }, [id]);

    if (loading) return <div className="loading">Loading hotel details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!hotel) return <div className="not-found">Hotel not found</div>;
    if (!reservation) return <div className="not-found">Reservation not found</div>;

    return (

        <div className="reservation-card">
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
                    <span>{reservation.adultsCount} adult{reservation.adultsCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Total:</span>
                    <span className="price">${reservation.totalPrice.toLocaleString()}</span>
                </div>
            </div>

            {reservation.paymentMethod && (
                <div className="payment-method">
                    <span>Paid with: {reservation.paymentMethod.cardType} ending in {reservation.paymentMethod.cardNumber.slice(-4)}</span>
                </div>
            )}
            <button>Cancel order</button>
        </div>
    );
}