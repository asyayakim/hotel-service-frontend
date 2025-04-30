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
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starNumber) => {
                const isFilled = starNumber <= (hoverRating || rating);

                return (
                    <button
                        key={starNumber}
                        type="button"
                        className={`p-1 transition-colors duration-200 ${
                            editable ? "cursor-pointer" : "cursor-default"
                        }`}
                        onClick={() => handleClick(starNumber)}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!editable}
                    >
                        <img
                            src={isFilled ? "https://img.icons8.com/?size=100&id=qdQpy48X3Rjv&format=png&color=000000" : "https://img.icons8.com/?size=100&id=104&format=png&color=000000"}
                            alt={`${starNumber} star`}
                            className="w-8 h-8"
                            width="24px"
                            height="24px"
                        />
                    </button>
                );
            })}
        </div>
    );
}