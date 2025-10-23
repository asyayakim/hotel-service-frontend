type ButtonProps = {
    name?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
};

export default function Button({ name, type = "button", onClick, className }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} className={`button-job ${className}`}>
            {name}
        </button>
    );
}
