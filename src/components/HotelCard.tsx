import { Link } from "react-router-dom";

export interface HotelCardProps {
    hotel: {
        hotelId: number;
        name: string;
        city: string;
        country: string;
        price: number;
        thumbnailUrl?: string;
        isFavorite?: boolean;
    };
    onFavoriteToggle: (hotelId: number) => void;
}
export default function HotelCard({ hotel, onFavoriteToggle }: HotelCardProps) {
    return (
        <div className="hotel-card">
            <div className="hotel-img-container">
                <div className="favorite-icon">
                    <svg onClick={() => onFavoriteToggle(hotel.hotelId)}
                        fill={hotel.isFavorite ? "red" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </div>
                <img
                    className="hotel-img"
                    src={hotel.thumbnailUrl || "/placeholder-hotel.jpg"}
                    alt={hotel.name || "Hotel image"}
                />
            </div>
            <div className="hotel-content">
                <h3>{hotel.city}</h3>
                <p>{hotel.country}</p>
                <h2>{hotel.name || "Noname Hotel"}</h2>
                <div className="price-section">
                    <p className="price-label">Starting from</p>
                    <div className="price-value">
                        {hotel.price} $
                    </div>
                    <span className="price-label">per night</span>
                </div>
                <Link to={`/hotel/${hotel.hotelId}`} className="button-main">
                    View Details
                </Link>
            </div>
        </div>
    )
}