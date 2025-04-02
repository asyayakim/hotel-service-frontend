import { useEffect, useState } from "react";
type Hotel = {
    id: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    logPrice: number;
};

export default function MainView() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        fetchHotels(1, 10); 
    }, []);

    const fetchHotels = async (newPageNumber = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5003/hotel?pageNumber=${newPageNumber}&pageSize=${pageSize}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to load hotels.");
            }

            const data = await response.json();
            setHotels(data.hotels);
            setTotalPages(data.TotalPages);
            setPageNumber(newPageNumber);
        } catch (err) {
            setError("Failed to load hotels.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hotels-section">
            <div className="hotels-container">
                {error && <p className="error-message">{error}</p>}
                {loading ? (
                    <p>Loading hotels...</p>
                ) : (
                    <>
                        <div className="hotels-container">
                            <div className="hotels-grid">
                            {hotels ? (
                                hotels.map((hotel) => (
                                    
                                    <div key={hotel.id} className="hotel-card">
                                        <img className="hotel-img" src={hotel.thumbnailUrl || "src/assets/noImage.png"} alt="Hotel Thumbnail" />
                                        <h4>{hotel.name || "Noname Hotel"}</h4>
                                        <h4>Price:</h4> {hotel.logPrice.toString().slice(0,5)}kr pr night
                                        <button className="button-main">Check Availability</button>
                                    </div>
                                ))
                            ) : (
                                <p>No hotels found.</p>
                            )}
                            </div>
                        </div>

                        <div className="pagination-controls">
                            <button onClick={() => fetchHotels(pageNumber - 1)} disabled={pageNumber <= 1}>
                                ◀
                            </button>
                            <span>Page {pageNumber} of {totalPages}</span>
                            <button onClick={() => fetchHotels(pageNumber + 1)} disabled={pageNumber >= totalPages}>
                                ▶
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}