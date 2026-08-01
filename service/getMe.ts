"use server"

import { getAccessToken } from "./refreshToken";

export const getMe = async () => {
   const accessToken = await getAccessToken();
// console.log("TOKEN IN GETME:", accessToken);

    if(!accessToken){
        // throw new Error("User Not Logged In!");

        return {
            success : false,
            message : "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers : {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie : `accessToken=${accessToken}`
        },

        cache: "no-store",
        // next : {
        //     revalidate : 60 * 60 * 24, // 1day
        //     tags : ["my-profile"]
        // }
    });

    const result = await res.json();
    // console.log("RESULT FROM BACKEND:", result);


    return result
}