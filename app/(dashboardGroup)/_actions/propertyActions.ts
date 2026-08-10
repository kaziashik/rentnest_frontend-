"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";

type PropertyState = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: Record<string, unknown>;
} | null;

function revalidatePropertyCaches() {
  revalidateTag("my-properties", "max");
  revalidateTag("properties", "max");
  revalidatePath("/landlord-dashboard/properties");
  revalidatePath("/landlord-dashboard");
  revalidatePath("/properties");
}

export const createProperty = async (
  prevState: PropertyState,
  formData: FormData,
) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const featuresRaw = String(formData.get("fetures") ?? "");

  const payload = {
    title: formData.get("title"),
    location: formData.get("location"),
    categoryId: formData.get("categoryId"),
    rentPrice: Number(formData.get("rentPrice")),
    bedRooms: Number(formData.get("bedRooms")),
    bathRooms: Number(formData.get("bathRooms")),
    fetures: featuresRaw
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    availability: formData.get("availability"),
    property_image: formData.getAll("property_image") as string[],
  };

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/properties/landlord`,
    {
      method: "POST",
      headers: {
        Cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidatePropertyCaches();
  }

  return result;
};
