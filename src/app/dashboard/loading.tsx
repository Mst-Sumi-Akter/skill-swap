import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
    // We specify a slightly different behavior or just re-use the spinner
    // For dashboard, we want it to feel fast, so we show the same spinner
    return (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
}
