import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function GET(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    await dbConnect();
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
