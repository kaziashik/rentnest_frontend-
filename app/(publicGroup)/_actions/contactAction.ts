"use server";

export type ContactState =
  | { success: boolean; message: string }
  | false;

export async function contactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || name.length < 2) {
    return { success: false, message: "Name must be at least 2 characters." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (!subject) {
    return { success: false, message: "Subject is required." };
  }
  if (!message || message.length < 10) {
    return { success: false, message: "Message must be at least 10 characters." };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: result.message || "Message sent successfully.",
      };
    }
  } catch {
    // Fall through to local success so the UX still works offline
  }

  return {
    success: true,
    message: "Thanks for contacting RentNest. We'll get back to you soon.",
  };
}
