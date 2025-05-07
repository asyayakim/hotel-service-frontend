import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserProvider.tsx";
import {Link} from "react-router-dom";

type Hotel = {
    hotelId: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    price: number;
    isFavorite?: boolean;
};

export default function FavoriteHotels() {
    const { user } = useContext(UserContext)!;
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const fetchAllHotels = async () => {
        const response = await fetch("http://localhost:5003/hotel/all-hotels?pageNumber=1&pageSize=100");
        const data = await response.json();
        return data.hotels;
    };
    
    const handleRemoveFromFavorites = (hotelId: number) => {
        removeFromLocal(hotelId);
        if (user)
            handleRemoveFromDb(hotelId);
        setHotels(prev =>
            prev?.map(hotel =>
                hotel.hotelId === hotelId ? { ...hotel, isFavorite: false } : hotel
            )
        );
    };
    const handleRemoveFromDb = async (hotelId: number) => {

        try {
             await fetch("http://localhost:5003/api/favorite", {
                method: "PATCH",
                headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    hotelId,
                    userId: user?.id,
                })
            });
        } catch (error) {
            console.error("Update error:", error);
        } 
    }
    const removeFromLocal = (hotelId: number) => {
        const favs: number[] = JSON.parse(localStorage.getItem("guestFavorites") || "[]");
        const updatedFavs = favs.filter(id => id !== hotelId);
        localStorage.setItem("guestFavorites", JSON.stringify(updatedFavs));
    };
    const fetchFavoriteIdsFromAPI = async (): Promise<number[]> => {
        const response = await fetch(`http://localhost:5003/api/favorite/all-by-user`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.map((f: { hotelId: number }) => f.hotelId);
        }
        return [];
    };
    
    const getLocalFavorites = (): number[] => {
        return JSON.parse(localStorage.getItem("guestFavorites") || "[]");
    };

    useEffect(() => {
        const loadFavorites = async () => {
            setLoading(true);
            try {
                const allHotels = await fetchAllHotels();
                let favoriteIds: number[] = [];
                if (user) {
                    favoriteIds = await fetchFavoriteIdsFromAPI();
                } else {
                    favoriteIds = getLocalFavorites();
                }

                const filteredHotels = allHotels
                    .filter((hotel: Hotel) => favoriteIds.includes(hotel.hotelId))
                    .map((hotel: Hotel) => ({ ...hotel, isFavorite: true }));

                setHotels(filteredHotels);
            } catch (err) {
                console.error("Failed to load favorite hotels", err);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [user]);

    return (
        <main>
        <section className="hotels-section-favorite">
            <div className="hotels-container">
                {loading ? (
                    <p>Loading hotels...</p>
                ) : hotels.length ? (
                    <div className="hotels-grid">
                        {hotels.map((hotel) => (
                            <div key={hotel.hotelId} className="hotel-card">
                                <div className="hotel-img-container">
                                    <div className="favorite-icon">
                                        <svg
                                            onClick={() => handleRemoveFromFavorites(hotel.hotelId)}
                                            fill={hotel.isFavorite ? "red" : "none"}
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                    </div>
                                    <img
                                        className="hotel-img"
                                        src={hotel.thumbnailUrl || "/placeholder-hotel.jpg"}
                                        alt={hotel.name || "Hotel image"}
                                    />
                                </div>
                                <div className="hotel-content">
                                    <h4>{hotel.name || "Noname Hotel"}</h4>
                                    <div className="price-section">
                                        <p className="price-label">Starting from</p>
                                        <div className="price-value">{hotel.price} $</div>
                                        <span className="price-label">per night</span>
                                    </div>
                                    <Link to={`/hotel/${hotel.hotelId}`} className="button-main">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">No favorite hotels found</p>
                )}
            </div>
        </section>
        </main>
    );
}


