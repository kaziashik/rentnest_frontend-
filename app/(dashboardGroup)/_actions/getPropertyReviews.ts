export const getPropertyReviews = async (propertyId: string) => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/review/${propertyId}`, {
        cache: "force-cache",
        next: {
            revalidate: 60 * 60,
            tags: [`property-reviews-${propertyId}`]
        }
    });

    const result = await res.json();

    return result;
}