"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getAccessToken, getNewAccessToken } from "@/service/refreshToken";

type PropertyState = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: Record<string, any>;
} | null;

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

  const payload = {
    title: formData.get("title"),
    location: formData.get("location"),
    categoryId: formData.get("categoryId"),
    rentPrice: Number(formData.get("rentPrice")),
    bedRooms: Number(formData.get("bedRooms")),
    bathRooms: Number(formData.get("bathRooms")),
    fetures: (formData.get("fetures") as string)
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
    revalidateTag("my-properties", {
      expire: 0,
    });
  }

//   console.log("Creat Property",result);

  return result;
};
