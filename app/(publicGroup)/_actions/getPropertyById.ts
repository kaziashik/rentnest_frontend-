// _actions/getPropertyById.ts
"use server"

export const getPropertyById = async (propertyId: string) => {

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${propertyId}`, {
        cache: "no-cache",
        next: {
            revalidate: 60,
            tags: ["properties", `property-${propertyId}`]
        }
    });

    const result = await res.json();

    return result;
}