import axios from "axios";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Only POST requests allowed" }),
      { status: 405 },
    );
  }

  const data = await req.json();
  const { token } = data;
  const secretKey: string | undefined = process.env.CAPTCHA_SECRET_KEY; // ✅ Use CAPTCHA_SECRET_KEY here

  if (!token) {
    return new Response(JSON.stringify({ message: "Token not found" }), {
      status: 405,
    });
  }

  if (!secretKey) { // ✅ Added check for secretKey to prevent errors if not set
    console.error("CAPTCHA_SECRET_KEY is not defined in environment variables.");
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    );

    if (response.data.success) {
      return new Response(JSON.stringify({ message: "Success" }), {
        status: 200,
      });
    } else {
      console.error("reCAPTCHA verification failed:", response.data); // Log for debugging
      return new Response(JSON.stringify({ message: "Failed to verify" }), {
        status: 405,
      });
    }
  } catch (error: any) {
    // Type error for error
    console.error("Error during reCAPTCHA verification:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}