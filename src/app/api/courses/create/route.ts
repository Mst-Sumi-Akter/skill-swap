import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const userId = session.user.id; // From NextAuth session

        const body = await req.json();
        const { title, description, platform, category, thumbnailUrl } = body;

        const newCourse = await Course.create({
            title,
            description,
            platform,
            category,
            thumbnailUrl,
            currentOwner: userId,
            status: "pending",
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error("Create course error:", error);
        return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
}
