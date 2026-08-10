export const getCategories = async () => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
        cache: "no-store",
    });

    const result = await res.json();

    return result;
}