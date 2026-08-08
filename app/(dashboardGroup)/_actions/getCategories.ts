export const getCategories = async () => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24, // 1 day, categories rarely change
            tags: ["categories"]
        }
    });

    const result = await res.json();

    return result;
}