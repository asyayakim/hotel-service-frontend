type Props = {
    iconSrc: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputContainer({ iconSrc, placeholder, value, onChange }: Props) {
    return (
        <div className="input-container">
            <img
                src={iconSrc}
                alt={`${placeholder} Icon`}
                className="icon"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
}

