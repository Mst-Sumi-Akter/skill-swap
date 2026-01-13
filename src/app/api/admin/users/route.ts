import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET all users for admin
export async function GET(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// PATCH update user role
export async function PATCH(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    try {
        const { userId, role } = await req.json();

        if (!["user", "admin"].includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
