import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
        return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        {
            method: "POST",
            body: uploadFormData,
        }
    );

    const result = await res.json();

    if (!result.success) {
        return NextResponse.json({ success: false, message: "Image upload failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: result.data.url });
}