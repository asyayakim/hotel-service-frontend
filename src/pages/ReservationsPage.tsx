import {useContext, useEffect, useState} from "react";
import {UserContext} from "../components/UserProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
type Hotel = {
    hotelId: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    price: number;
    room: Room[];
}
type Room = {
    roomId: number;
    roomType: string;
    pricePerNight: number;
    thumbnailRoom: string;
}
export default function ReservationsPage() {

    const {user} = useContext(UserContext)!;
    const {id} = useParams<{ id: string }>();
    const hotelId = id && !isNaN(parseInt(id)) &&
    parseInt(id) > 0 ? parseInt(id) : null;
    const [loading, setLoading] = useState<boolean>(true);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHotel = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:5003/hotel/from-db/${hotelId}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.token}`,
                    }
                });
                const data: Hotel = await response.json();
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
    [];
    if (loading) return <div className="loading">Loading hotel details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!hotel) return <div className="not-found">Hotel not found</div>;
    return (

        <div className="hotel-page">

            <div className="hotel-content">
                <div className="booking-section">
                    <div className="header-container">
                        <div className="hotel-header">
                            <h1>{hotel.name}</h1>
                        </div>
                    </div>
                    <div className="gallery">
                        <img
                            src={hotel.thumbnailUrl || "/placeholder-hotel.jpg"}
                            alt={hotel.name}
                            className="main-image"
                        />
                    </div>
                    <div className="text-section">
                        <p className="description">{hotel.description}</p>
                    </div>
                </div>

                <div className="booking-section">

                    <div className="guest-selection">
                        <label>Guests:</label>
                    </div>
                        <div className="price-summary">
                            <h3>Your Stay</h3>
                            <div className="room-selected">
                                <span>Total:</span>
                            </div>
                        </div>
                    )
                </div>
            </div>
        </div>
    );
}