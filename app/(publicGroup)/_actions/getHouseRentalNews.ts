"use server";

export const getHouseRentalProperties = async ({
  query,
}: {
  query?: { [key: string]: string | string[] | undefined };
}) => {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    return {
      success: false,
      message:
        "BACKEND_API_URL is not set. Point it to your RentNest backend (e.g. https://rentnestbackend.vercel.app).",
      data: { data: [], meta: { page: 1, limit: 9, total: 0 } },
    };
  }

  const params = new URLSearchParams();

  if (query?.title) params.set("title", query.title as string);
  if (query?.location) params.set("location", query.location as string);
  if (query?.minPrice) params.set("minPrice", query.minPrice as string);
  if (query?.maxPrice) params.set("maxPrice", query.maxPrice as string);
  if (query?.category) params.set("category", query.category as string);
  if (query?.sort) params.set("sort", query.sort as string);
  params.set("page", (query?.page as string) ?? "1");
  params.set("limit", (query?.limit as string) ?? "9");

  try {
    const res = await fetch(`${baseUrl}/api/properties?${params.toString()}`, {
      cache: "no-store",
      next: {
        tags: ["properties"],
      },
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result) {
      return {
        success: false,
        message: `Could not load properties from ${baseUrl} (HTTP ${res.status}). Make sure RentNest backend is running — not another API on the same port.`,
        data: { data: [], meta: { page: 1, limit: 9, total: 0 } },
      };
    }

    // RentNest shape: { success, data: { data: Property[], meta } }
    if (result.success && Array.isArray(result.data?.data)) {
      return result;
    }

    return {
      success: false,
      message: `Unexpected API response from ${baseUrl}. Confirm BACKEND_API_URL points to RentNest (roles TENANT/LANDLORD/ADMIN), not another project.`,
      data: { data: [], meta: { page: 1, limit: 9, total: 0 } },
    };
  } catch {
    return {
      success: false,
      message: `Failed to reach RentNest API at ${baseUrl}. Start rentnest_backend or use https://rentnestbackend.vercel.app.`,
      data: { data: [], meta: { page: 1, limit: 9, total: 0 } },
    };
  }
};
