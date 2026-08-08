"use server"

export const getHouseRentalProperties = async ({ query }: { query?: { [key: string]: string | string[] | undefined } }) => {

    const params = new URLSearchParams()

    if (query?.title) params.set("title", query.title as string)
    if (query?.location) params.set("location", query.location as string)
    if (query?.minPrice) params.set("minPrice", query.minPrice as string)
    if (query?.maxPrice) params.set("maxPrice", query.maxPrice as string)
    if (query?.category) params.set("category", query.category as string)
    if (query?.sort) params.set("sort", query.sort as string)
    params.set("page", (query?.page as string) ?? "1")
    params.set("limit", (query?.limit as string) ?? "9")

    

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties?${params.toString()}`, {
    cache: "no-cache",
    next: {
        revalidate : 60 * 60 * 6,
        tags: ["properties"]
    }
});

const result = await res.json();
return result;
}