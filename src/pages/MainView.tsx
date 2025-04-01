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
            setHotels(data.Hotels);
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
                        <div className="hotels-grid">
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <div key={hotel.id} className="hotel-card">
                                        <h3>{hotel.name || "Noname Hotel"}</h3>
                                        <p>{hotel.description || "No description available"}</p>
                                        <img src={hotel.thumbnailUrl || ""} alt="Hotel Thumbnail" width="100" />
                                        <p>Price: {hotel.logPrice}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No hotels found.</p>
                            )}
                        </div>

                        <div className="pagination-controls">
                            <button onClick={() => fetchHotels(pageNumber - 1)} disabled={pageNumber <= 1}>
                                Previous
                            </button>
                            <span>Page {pageNumber} of {totalPages}</span>
                            <button onClick={() => fetchHotels(pageNumber + 1)} disabled={pageNumber >= totalPages}>
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}