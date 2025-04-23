import {useContext, useEffect, useState} from "react";
import {DateRange, Range, RangeKeyDict} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {addDays} from "date-fns";
import {useNavigate, useParams} from "react-router-dom";
import {UserContext} from "../components/UserProvider.tsx";

type Hotel = {
    hotelId: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    price: number;
    rooms: Room[];
};
type Room = {
    roomId: number;
    roomType: string;
    pricePerNight: number;
    thumbnailRoom: string;
}

export default function HotelPage() {

    const {user} = useContext(UserContext)!;
    const {id} = useParams<{ id: string }>();
    const hotelId = id && !isNaN(parseInt(id)) &&
    parseInt(id) > 0 ? parseInt(id) : null;
    const [loading, setLoading] = useState<boolean>(true);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: "selection"
        }
    ]);
    const [guests, setGuests] = useState<number>(1);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    useEffect(() => {
        const fetchHotel = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:5003/hotel/from-db/${hotelId}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                const data: Hotel = await response.json();
                setHotel(data);
                if (data.rooms.length > 0) {
                    setSelectedRoom(data.rooms[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load hotel details");
                console.error("Error fetching hotel:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [hotelId]);
    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                if (!selectedRoom?.roomId) return;
                const response = await fetch(`http://localhost:5003/reservation/available-date/${selectedRoom?.roomId}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                const reservations = await response.json();
                const allDates = reservations.flatMap((res: any) => {
                    const start = new Date(res.checkInDate);
                    const end = new Date(res.checkOutDate);
                    const dates = [];

                    let current = new Date(start);
                    while (current < end) {
                        dates.push(new Date(current));
                        current = addDays(current, 1);
                    }
                    return dates;
                });
                setDisabledDates(allDates);
            } catch (err) {
                console.error("Error fetching unavailable dates:", err);
            }
        };
        fetchUnavailableDates()
    }, [selectedRoom?.roomId]);
    
    
    const handleSelect = (ranges: RangeKeyDict) => {
        setDateRange([ranges.selection]);
    };

    const calculateTotal = (): number => {
        if (!selectedRoom || !dateRange[0].startDate || !dateRange[0].endDate) return 0;
        const diffTime = Math.abs(dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * selectedRoom.pricePerNight;
    };

    const startReservation = async () => {
        if (!user) {
            alert("Please login to select a hotel");
            return;
        }
        if (!selectedRoom || !dateRange[0].startDate || !dateRange[0].endDate) return;

        setShowConfirmation(true);
        navigate("/payment", {
            state: {
                roomId: selectedRoom.roomId,
                checkInDate: dateRange[0].startDate,
                checkOutDate: dateRange[0].endDate,
                totalPrice: calculateTotal(),
                hotelId: hotelId,
                hotelName: hotel?.name,
                adultsCount: guests,
                imageUrl: hotel?.thumbnailUrl,
            }
        });
    }

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
                    <div className="thumbnails">
                        {hotel.rooms.map(room => (
                            <img
                                key={room.roomId}
                                src={room.thumbnailRoom || "/placeholder-room.jpg"}
                                alt={room.roomType}
                                className={`thumbnail ${selectedRoom?.roomId === room.roomId ? 'active' : ''}`}
                                onClick={() => setSelectedRoom(room)}
                            />
                        ))}
                    </div>
                </div>
                    <div className="text-section">
                    <p className="description">{hotel.description}</p>
                    </div>
                </div>

                <div className="booking-section">
                    <h2>Available Rooms</h2>
                    <div className="room-options">
                        {hotel.rooms.map(room => (
                            <div
                                key={room.roomId}
                                className={`room-card ${selectedRoom?.roomId === room.roomId ? 'selected' : ''}`}
                                onClick={() => setSelectedRoom(room)}
                            >
                                <h3>{room.roomType}</h3>
                                <p>${room.pricePerNight.toFixed(2)} per night</p>
                            </div>
                        ))}
                    </div>

                    <div className="date-selection">
                        <h2>Select Dates</h2>
                        <DateRange
                            editableDateInputs={true}
                            onChange={handleSelect}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            minDate={new Date()}
                            rangeColors={["var(--primary)"]}
                            disabledDates={disabledDates}
                            disabledDay={(date) =>
                                disabledDates.some(disabledDate => 
                                    date.toDateString() === disabledDate.toDateString(),
                                )
                            }
                        />
                    </div>

                    <div className="guest-selection">
                        <label>Guests:</label>
                        <input
                            type="number"
                            min="1"
                            max="4"
                            value={guests}
                            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    {selectedRoom && (
                        <div className="price-summary">
                            <h3>Your Stay</h3>
                            <div className="room-selected">
                                <span>{selectedRoom.roomType}</span>
                                <span> ${selectedRoom.pricePerNight.toFixed(2)}/night</span>
                            </div>
                            <div className="dates-selected">
                                {dateRange[0].startDate?.toLocaleDateString()} - {dateRange[0].endDate?.toLocaleDateString()}
                            </div>
                            <div className="total-price">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <button
                        className="reserve-button"
                        onClick={startReservation}
                        disabled={!selectedRoom || !dateRange[0].startDate || !dateRange[0].endDate}
                    >
                        Reserve Now
                    </button>
                </div>
            </div>

            {showConfirmation && selectedRoom && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <h3>Booking Confirmed!</h3>
                        <p>Your reservation for {selectedRoom.roomType} at {hotel.name} has been confirmed.</p>
                        <button
                            className="close-button"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}