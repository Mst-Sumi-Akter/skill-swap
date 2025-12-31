import { signIn } from "@/auth";
import { NextResponse } from "next/server";
import { AuthError } from "next-auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

      
        await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        return NextResponse.json({ message: "Login successful" }, { status: 200 });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                default:
                    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
            }
        }

        
        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    }
}
