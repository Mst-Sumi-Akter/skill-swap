import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";

export async function GET(req: Request, { params }: { params: Promise<{ platform: string }> }) {
    await dbConnect();
    try {
        const { platform } = await params;
        // Case insensitive search
        const courses = await Course.find({
            platform: { $regex: new RegExp(platform, "i") },
            status: "approved",
            isAvailable: true
        })
            .populate("currentOwner", "name photoURL email")
            .sort({ createdAt: -1 });

        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses by platform" }, { status: 500 });
    }
}
