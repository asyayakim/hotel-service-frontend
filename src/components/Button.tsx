type ButtonProps = {
    name?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
};

export default function Button({ name, type = "button", onClick, className, disabled }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} className={`button-job ${className}`} disabled={disabled}>
            {name}
        </button>
    );
}
