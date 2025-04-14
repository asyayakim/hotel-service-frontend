import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";

export default function PaymentPage() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext)!;
    const location = useLocation();
    const {
        hotelId
    } = location.state || {};
    const reservationDetails = location.state;

    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        billingAddress: "",
        cardType: "Visa" 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const paymentResponse = await fetch("http://localhost:5003/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CustomerId: user?.id,
                    CardType: cardDetails.cardType,
                    CardNumber: cardDetails.cardNumber,
                    ExpirationDate: cardDetails.expiry,
                    CVV: cardDetails.cvv,
                    BillingAddress: cardDetails.billingAddress
                })
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.message || "Payment failed");
            }

            const paymentData = await paymentResponse.json();

            const reservationResponse = await fetch(`http://localhost:5003/reservation/hotel/${hotelId}`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CustomerId: user?.id,
                    RoomId: reservationDetails.roomId,
                    CheckInDate: reservationDetails.checkInDate.toISOString().split('T')[0],
                    CheckOutDate: reservationDetails.checkOutDate.toISOString().split('T')[0],
                    TotalPrice: reservationDetails.totalPrice,
                    PaymentMethodId: paymentData.paymentMethodId
                })
            });

            if (!reservationResponse.ok) {
                const errorData = await reservationResponse.json();
                throw new Error(errorData.message || "Reservation failed");
            }

            navigate("/confirmation");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h2 className="payment-title">Payment Information</h2>

                <form onSubmit={handleSubmit}>
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
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails.cardNumber}
                                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                maxLength="19"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Expiration Date</label>
                            <div className="input-field">
                                <i className="bi bi-calendar"></i>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    maxLength="5"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>CVV</label>
                            <div className="input-field">
                                <i className="bi bi-lock"></i>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                    maxLength="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Billing Address</label>
                        <div className="input-field">
                            <i className="bi bi-geo-alt"></i>
                            <input
                                type="text"
                                placeholder="123 Main St, City, Country"
                                value={cardDetails.billingAddress}
                                onChange={(e) => setCardDetails({...cardDetails, billingAddress: e.target.value})}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>

                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
}