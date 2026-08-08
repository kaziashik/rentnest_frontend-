"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken"

type LoginState = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  redirectTo : string, prevState : LoginState , formData: FormData
) => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return {
      success: false,
      message: "BACKEND_API_URL is not configured.",
    };
  }

  const payload = {
    email,
    password,
  };

  let result: any;
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    result = await res.json();
  } catch {
    return {
      success: false,
      message: `Cannot reach RentNest API at ${baseUrl}. Check BACKEND_API_URL.`,
    };
  }

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
    

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });


    const decodedToken=jwt.decode(result.data.accessToken) as JwtPayload
    // console.log(decodedToken);

    //redirect to user
      if(redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")){
            redirect(redirectTo)
        }


    if(decodedToken.role==="TENANT"){
      redirect("/dashboard");
    }
    else if(decodedToken.role ==="ADMIN"){
      redirect("/admin-dashboard")
    }
    else if (decodedToken.role==="LANDLORD"){
      redirect("/landlord-dashboard")
    }

    
  }
  return result;
};





// ##########################
//     registion user
// ##########################

type RegisterState =
  | {
      success: boolean;
      message: string;
    }
  | false;

export const registerAction = async (
    prevState: RegisterState,
    formData: FormData,
  ) => {
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      phone: formData.get("phone"),
      photo: formData.get("photo") || null,
    };
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const result = await res.json();
    if (result.success) {
      redirect("/login");
    }

    return result
  };