type LoadingProps = {
    message?: string;
};
export default function Loading({ message }: LoadingProps) {
    return (
        <main>
        <div className="loading">
            <div className="cheerful-loader">
                <div className="bounce bounce1"></div>
                <div className="bounce bounce2"></div>
                <div className="bounce bounce3"></div>
            </div>
            <div className="loading-text">{ message }</div>
            </div>
            </main>
    );
}