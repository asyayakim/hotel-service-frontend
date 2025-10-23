type Props = {
    iconSrc: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    min?: string;
    max?: string;
    type?: string;
};

export default function InputContainer({ iconSrc, placeholder, value, onChange, required, min, max, type }: Props) {
    return (
        <div className="input-container">
            <img
                src={iconSrc}
                alt={`${placeholder} Icon`}
                className="icon"
            />
            <input
                type={type || "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
            />
        </div>
    );
}

