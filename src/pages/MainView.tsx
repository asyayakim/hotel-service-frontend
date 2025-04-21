import {useContext, useEffect, useState} from "react";

import {Link} from "react-router-dom";
import {UserContext} from "../components/UserProvider.tsx";


type Hotel = {
    hotelId: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    price: number;
    isFavorite?: boolean;
};

export default function MainView() {
    const { user } = useContext(UserContext)!;
    const [hotels, setHotels] = useState<Hotel[]>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchHotels(1, 10);
          if (!user) {
            const localFavs = getLocalFavorites();
            setHotels(prev =>
                prev?.map(hotel =>
                    localFavs.includes(hotel.hotelId)
                        ? { ...hotel, isFavorite: true }
                        : hotel
                )
            );
        }
    }, []);
    const saveToLocalFavorites = (hotelId: number) => {
        let favs = JSON.parse(localStorage.getItem("guestFavorites") || "[]");
        if (!favs.includes(hotelId)) {
            favs.push(hotelId);
            localStorage.setItem("guestFavorites", JSON.stringify(favs));
        }
    };
    const getLocalFavorites = (): number[] => {
        return JSON.parse(localStorage.getItem("guestFavorites") || "[]");
    };
    const fetchFavorites = async () => {
        const response = await fetch(`http://localhost:5003/api/favorite/all-by-user`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const favoriteIds = data.map((f: { hotelId: number }) => f.hotelId);
            setHotels(prev =>
                prev?.map(hotel => ({
                    ...hotel,
                    isFavorite: favoriteIds.includes(hotel.hotelId)
                }))
            );
        }
    };

    const fetchHotels = async (newPageNumber = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5003/hotel/all-hotels?pageNumber=${newPageNumber}&pageSize=${pageSize}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            const data = await response.json();
            setHotels(data.hotels);
            setTotalPages(data.TotalPages);
            setPageNumber(newPageNumber);
            if (user){
                await fetchFavorites();
            }
        } catch (err) {
            setError("Failed to load hotels.");
        } finally {
            setLoading(false);
        }
    };
    const AddToFavorite = async (hotelId: number) => {
        setFavoriteLoading(hotelId);
        if (!user) {
            saveToLocalFavorites(hotelId);
            setHotels(prev => prev?.map(hotel =>
                hotel.hotelId === hotelId
                    ? { ...hotel, isFavorite: true }
                    : hotel
            ));
            return;
        }
        try {
            const response = await fetch(`http://localhost:5003/api/favorite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    hotelId: hotelId,
                    userId: user.id,
                }),
            });
            if (response.ok) {
                setHotels(prev => prev?.map(hotel =>
                    hotel.hotelId === hotelId
                        ? { ...hotel, isFavorite: true }
                        : hotel
                ));
            }
             const data = await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add favorite");
        }
        finally {
        setFavoriteLoading(null);
    }
    }
    return (
        <section className="hotels-section">
            <div className="hotels-container">
                {loading ? (
                    <p>Loading hotels...</p>
                ) : (
                    <>
                        <div className="hotels-grid">
                            {hotels?.length ? (
                                hotels.map((hotel) => (
                                    <div key={hotel.hotelId} className="hotel-card">
                                        <div className="hotel-img-container">
                                            <div className="favorite-icon">
                                                <svg onClick={() => AddToFavorite(hotel.hotelId)}
                                                     fill={hotel.isFavorite ? "red" : "none"}
                                                     stroke="currentColor"
                                                     strokeWidth="1.5"
                                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
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
                                ))
                            ) : (
                                <p className="no-results">No hotels found</p>
                            )}
                        </div>

                        <div className="pagination-controls">
                            <button
                                className="button-extra"
                                onClick={() => fetchHotels(pageNumber - 1)}
                                disabled={pageNumber <= 1}
                            >
                                Previous
                            </button>
                            <span className="price-label"> &nbsp; Page {pageNumber} of {totalPages} &nbsp; </span>
                            <button
                                onClick={() => fetchHotels(pageNumber + 1)}
                                disabled={pageNumber >= totalPages}
                                className="button-extra"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}