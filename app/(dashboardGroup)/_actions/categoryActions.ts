"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { getAccessToken } from "@/service/refreshToken";


export const createCategory = async (prevState: any, formData: FormData) => {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const description = String(formData.get("description") ?? "").trim();

    const payload = {
      name: formData.get("name"),
      ...(description ? { description } : { description: null }),
    };

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/categories`,
      {
        method: "POST",
        headers: {
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to create category",
      };
    }

    if (result.success) {
      revalidateTag("categories", "max");
    }

    return result;
  } catch (error) {
    console.error("Create category error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating category",
    };
  }
};

export const updateCategory = async (
  categoryId: string,
  prevState: any,
  formData: FormData
) => {
  try {
 
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const description = String(formData.get("description") ?? "").trim();

    const payload = {
      name: formData.get("name"),
      ...(description ? { description } : { description: null }),
    };

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update category",
      };
    }

    if (result.success) {
      revalidateTag("categories", "max");
    }

    return result;
  } catch (error) {
    console.error("Update category error:", error);

    return {
      success: false,
      message: "Something went wrong while updating category",
    };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "User not logged in!",
      };
    }

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete category",
      };
    }

    if (result.success) {
      revalidateTag("categories", "max");
    }

    return result;
  } catch (error) {
    console.error("Delete category error:", error);

    return {
      success: false,
      message: "Something went wrong while deleting category",
    };
  }
};