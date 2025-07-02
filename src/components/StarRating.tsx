import { useState } from "react";
interface StarRatingProps {
    rating: number;
    onChange?: (rating: number) => void;
    editable?: boolean;
}

export function StarRating({ rating = 0, onChange, editable = true }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (newRating: number) => {
        if (editable && onChange) {
            onChange(newRating);
        }
    };

    const handleMouseEnter = (newHoverRating: number) => {
        if (editable) {
            setHoverRating(newHoverRating);
        }
    };

    const handleMouseLeave = () => {
        if (editable) {
            setHoverRating(0);
        }
    };


    return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNumber) => {
                const isFilled = starNumber <= (hoverRating || rating);

                return (
                    <button
                        key={starNumber}
                        type="button"
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: "4px",
                            cursor: editable ? "pointer" : "default",
                            outline: "none",
                            boxShadow: "none",
                            filter: "none",
                        }}
                        onClick={() => handleClick(starNumber)}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!editable}
                    >
                        <img
                            src={
                                isFilled
                                    ? "https://img.icons8.com/?size=100&id=qdQpy48X3Rjv&format=png&color=000000"
                                    : "https://img.icons8.com/?size=100&id=104&format=png&color=000000"
                            }
                            alt={`${starNumber} star`}
                            style={{
                                width: "32px",
                                height: "32px",
                                display: "block",
                                pointerEvents: "none",
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
}