import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import Swal from 'sweetalert2';

export const API_BASE_URL = "https://hotelservice-2cw7.onrender.com";
const POINTS_PER_DOLLAR = 5;

interface ReservationState {
    hotelId: number;
    roomId: number;
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
    imageUrl: string;
    hotelName: string;
    adultsCount: number;
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext)!;
    const location = useLocation();
    const reservationDetails = location.state as ReservationState;

    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        billingAddress: "",
        cardType: ""
    });
    const currentDate = new Date();
    const minExpiryDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1  
    );
    const maxExpiryDate = new Date(
        currentDate.getFullYear() + 10, 
        currentDate.getMonth(),
        1
    );

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year.toString().slice(-2)}-${month.toString()}/${day.toString().slice(-2)}-${day.toString().slice(-2)}`;
    };
   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usePoints, setUsePoints] = useState(true);
    const [pointsToUse, setPointsToUse] = useState(0);

    const maxUsablePoints = Math.min(
        user?.loyaltyPoints || 0,
        reservationDetails.totalPrice * POINTS_PER_DOLLAR
    );

    const pointsDiscount = pointsToUse / POINTS_PER_DOLLAR;
    const amountToPay = Math.max(0, reservationDetails.totalPrice - pointsDiscount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");


        if (usePoints && pointsToUse > (user?.loyaltyPoints || 0)) {
            setError("You don't have enough loyalty points");
            setLoading(false);
            return;
        }

        try {
            let paymentMethodId = null;


            if (amountToPay > 0) {
                const paymentResponse = await fetch(`${API_BASE_URL}/api/payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({
                        CustomerId: user?.id,
                        CardType: cardDetails.cardType,
                        CardNumber: cardDetails.cardNumber,
                        ExpirationDate: cardDetails.expiry,
                        CVV: cardDetails.cvv,
                        BillingAddress: cardDetails.billingAddress,
                        Amount: amountToPay
                    })
                });

                if (!paymentResponse.ok) {
                    const errorData = await paymentResponse.json();
                    throw new Error(errorData.message || "Payment failed");
                }

                const paymentData = await paymentResponse.json();
                paymentMethodId = paymentData.paymentMethodId;
            }

            const reservationResponse = await fetch(`${API_BASE_URL}/reservation/hotel/${reservationDetails.hotelId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    CustomerId: user?.id,
                    RoomId: reservationDetails.roomId,
                    CheckInDate: reservationDetails.checkInDate.toISOString().split('T')[0],
                    CheckOutDate: reservationDetails.checkOutDate.toISOString().split('T')[0],
                    TotalPrice: reservationDetails.totalPrice,
                    PaymentMethodId: paymentMethodId,
                    AdultsCount: reservationDetails.adultsCount,
                    PointsUsed: usePoints ? pointsToUse : 0,
                    PointsDiscount: pointsDiscount
                })
            });

            if (!reservationResponse.ok) {
                const errorData = await reservationResponse.json();
                throw new Error(errorData.message || "Reservation failed");
            }

            navigate("/")
            await Swal.fire({
                title: "Congratulations!",
                text: `Get ready for your trip to ${reservationDetails.hotelName}.`,
                imageUrl: reservationDetails.imageUrl,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "Hotel image",
                footer: usePoints
                    ? `You saved $${pointsDiscount.toFixed(2)} using ${pointsToUse} loyalty points!`
                    : undefined
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className="payment-container">
                <div className="payment-card">
                    <h2 className="payment-title">Payment Information</h2>
                    {user && user.loyaltyPoints > 0 && (
                        <div className="points-section">
                            <h3>Use Your Loyalty Points</h3>
                            <p>You have <strong>{user.loyaltyPoints}</strong> points <strong>(${(user.loyaltyPoints / POINTS_PER_DOLLAR).toFixed(2)} value)</strong>.</p>

                            <div className="toggle-points">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={usePoints}
                                        onChange={(e) => setUsePoints(e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span>{usePoints ? "Using points" : "Not using points"}</span>
                            </div>

                            {usePoints && (
                                <div className="points-control">
                                    <label>
                                        <i className="bi bi-sliders"></i>
                                        Use up to: <strong>{maxUsablePoints} points</strong> (${(maxUsablePoints / POINTS_PER_DOLLAR).toFixed(2)})
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxUsablePoints}
                                        step={1}
                                        value={pointsToUse}
                                        onChange={(e) => setPointsToUse(Number(e.target.value))}
                                    />
                                    <div className="points-details">
                                        <span>Points used: <strong>{pointsToUse}</strong></span>
                                        <span>Discount: <strong>${(pointsToUse / POINTS_PER_DOLLAR).toFixed(2)}</strong></span>
                                        <span>New total: <strong>${amountToPay.toFixed(2)}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="payment-summary">
                            <div className="summary-item">
                                <span>Original Price:</span>
                                <span>${reservationDetails.totalPrice.toFixed(2)}</span>
                            </div>

                            {usePoints && pointsToUse > 0 && (
                                <div className="summary-item">
                                    <span>Points Discount:</span>
                                    <span>-${pointsDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Amount to Pay:</span>
                                <span>${amountToPay.toFixed(2)}</span>
                            </div>
                        </div>

                        {amountToPay > 0 ? (
                            <>
                                <div className="form-group">
                                    <label>Card Type</label>
                                    <div className="card-types">
                                        {['visa', 'mastercard', 'amex'].map((type) => (
                                            <img
                                                key={type}
                                                src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${type}.png`}
                                                alt={type}
                                                className={`card-type ${cardDetails.cardType === type ? 'active' : ''}`}
                                                onClick={() => setCardDetails({...cardDetails, cardType: type})}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Card Number</label>
                                    <div className="input-field">
                                        <i className="bi bi-credit-card"></i>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.cardNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 16) {
                                                    setCardDetails({...cardDetails, cardNumber: value});
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiration Date</label>
                                        <div className="input-field">
                                            <i className="bi bi-calendar"></i>
                                            <input
                                                type="date"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({
                                                    ...cardDetails,
                                                    expiry: e.target.value
                                                })}
                                                min={formatDate(minExpiryDate)}
                                                max={formatDate(maxExpiryDate)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label><i className="bi bi-shield-lock"></i> CVV</label>
                                        <div className="input-field">
                                            <i className="bi bi-lock"></i>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    if (value.length <= 3) {
                                                        setCardDetails({...cardDetails, cvv: value});
                                                    }
                                                }}
                                                maxLength={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label><i className="bi bi-house"></i> Billing Address</label>
                                    <div className="input-field">
                                        <i className="bi bi-geo-alt"></i>
                                        <input
                                            type="text"
                                            placeholder="123 Main St, City, Country"
                                            value={cardDetails.billingAddress}
                                            onChange={(e) => setCardDetails({
                                                ...cardDetails,
                                                billingAddress: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="points-only-payment">
                                <i className="bi bi-check-circle"></i>
                                <span>Your points cover the entire payment!</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading || (amountToPay > 0 && !cardDetails.cardType)}

                        >
                            <i className="bi bi-lock"></i> {loading ? 'Processing...' : 'Complete Booking'}
                        </button>
                        <div className="security-note">
                            <i className="bi bi-shield-check"></i> Your payment information is securely encrypted
                        </div>

                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
            </div>
        </main>
    );
}