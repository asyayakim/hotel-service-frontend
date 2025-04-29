type ButtonProps = {
    name?: string;
    type?: "button" | "submit" | "reset";
    onClick: () => void;
    className?: string;
};

export default function Button({ name, type = "button", onClick }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} className="button-job">
            {name}
        </button>
    );
}
