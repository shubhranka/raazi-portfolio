import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;
    const userData = jwt.verify(token, process.env.JWT_SECRET!);
    if (!userData) {
        return NextResponse.json({ message: 'Invalid token.' }, { status: 400 });
    }

    return NextResponse.json(userData, { status: 200 })
}
    