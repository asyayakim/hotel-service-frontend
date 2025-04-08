import {useContext, useEffect, useState} from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import {useNavigate, useParams} from "react-router-dom";
import {UserContext} from "../components/UserProvider.tsx";

type Hotel = {
    id: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    logPrice: number;
};

export default function HotelPage() {
    const { user } = useContext(UserContext)!;
    const { id } = useParams<{ id: string }>();
    const hotelId = id ? parseInt(id) : 0;
    const [loading, setLoading] = useState<boolean>(true);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: "selection"
        }
    ]);
    const [guests, setGuests] = useState<number>(1);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHotel = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:5003/hotel/${hotelId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                console.log(data);
                setHotel(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load hotel details");
                console.error("Error fetching hotel:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [hotelId]);
    const startReservation = async () => {
        const response = await fetch(`http://localhost:5003/hotel/reservation/${hotelId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hotelId: hotelId, dateRange: dateRange, hotelPrice: hotel?.logPrice, user }),
        });
        console.log(response.json());
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setShowConfirmation(false)
            navigate("/payment");
        }
    }
    const handleSelect = (ranges: RangeKeyDict) => {
        setDateRange([ranges.selection]);
    };

    const calculateTotal = (): number => {
        if (!hotel || !dateRange[0].startDate || !dateRange[0].endDate) return 0;
        const diffTime = Math.abs(dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * hotel.logPrice;
    };

    if (loading) {
        return <div className="loading-message">Loading hotel details...</div>;
    }
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }
    if (!hotel) {
        return <div className="not-found-message">Hotel not found</div>;
    }
    return (
        <div className="hotel-page-container">
            <div className="hotel-gallery">
                <img
                    src={hotel.thumbnailUrl || "/placeholder-hotel.jpg"}
                    alt={hotel.name}
                    className="main-image"
                />
                <div className="thumbnail-grid">
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="thumbnail-placeholder"></div>
                    ))}
                </div>
            </div>

            <div className="hotel-details">
                <h1 className="hotel-title">{hotel.name}</h1>
                <p className="hotel-description">{hotel.description}</p>
                <div className="price-badge">
                    <span className="price">${hotel.logPrice.toFixed(2)}</span>
                    <span className="per-night">per night</span>
                </div>

                <div className="booking-widget">
                    <h2>Select Dates</h2>
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        minDate={new Date()}
                        rangeColors={["var(--primary)"]}
                    />

                    <div className="guest-selector">
                        <label>Guests:</label>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={guests}
                            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    <div className="price-summary">
                        <h3>Total for {dateRange[0].startDate && dateRange[0].endDate ?
                            Math.ceil(
                                (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) : 0} nights:</h3>
                        <div className="total-price">${calculateTotal().toFixed(2)}</div>
                    </div>
                    {!user ? ( 

                    <button
                        className="reserve-button"
                        onClick={() => alert("Login for reservation")}
                    >
                        Reserve Now
                    </button>
                    ) : (
                        <button
                            className="reserve-button"
                            onClick={() => startReservation}
                            disabled={!dateRange[0].startDate || !dateRange[0].endDate}
                        >
                            Reserve Now
                        </button>
                    )};
                    {showConfirmation && hotel && (
                        <div className="confirmation-modal">
                            <h3>Booking Confirmed!</h3>
                            <p>Your reservation at {hotel.name} has been confirmed.</p>
                            <button
                                className="close-button"
                                onClick={() => setShowConfirmation(false)}
                                
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}