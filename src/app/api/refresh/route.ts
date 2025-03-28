import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { token } = body;
    jwt.verify(token, process.env.NEXT_PUBLIC_JWT_REFRESH_SECRET!, (_:any, user: any) => {
        const token = jwt.sign(user , process.env.NEXT_PUBLIC_JWT_SECRET!)
        return NextResponse.json({ token }, { status: 200 });
    })

    return NextResponse.json({ message: 'Invalid token.' }, { status: 400 });
}
    