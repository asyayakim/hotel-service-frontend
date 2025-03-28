import { useEffect, useState } from "react";
import Button from "../components/Button.tsx";

type Hotel = {
    id: number;
    name: string;
};

export default function MainView() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayCount, setDisplayCount] = useState<number>(10);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5004/api/hotel", {
                method: "GET", // Fixed casing (was "Get")
                headers: { "Content-Type": "application/json" },
            });
            const data: Hotel[] = await response.json();
            setHotels(data);
        } catch (err) {
            setError("Failed to load hotels.");
        } finally {
            setLoading(false);
        }
    };

    const loadMoreHotels = () => {
        setDisplayCount(prevCount => prevCount + 10);
    };

    return (
        <section className="jobs-section" id="jobs">
            <div className="jobs-container">
                {error && <p className="error-message">{error}</p>}
                {loading ? (
                    <p>Loading hotels...</p>
                ) : (
                    <>
                        <div className="jobs-grid">
                            {hotels.length > 0 ? (
                                hotels.slice(0, displayCount).map((hotel) => (
                                    <div key={hotel.id}>{hotel.name || "Noname Hotel"}</div>
                                ))
                            ) : (
                                <p>No hotels found.</p>
                            )}
                        </div>

                        {hotels.length > displayCount && (
                            <div className="load-more-container">
                                <Button name="Load more" onClick={loadMoreHotels} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
