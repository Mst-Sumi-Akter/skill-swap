import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET all courses for admin
export async function GET(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    try {
        const courses = await Course.find({})
            .populate("currentOwner", "name email photoURL")
            .sort({ createdAt: -1 });

        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

// PATCH update course status
export async function PATCH(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    try {
        const { courseId, status } = await req.json();

        if (!["approved", "rejected", "pending"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { status },
            { new: true }
        ).populate("currentOwner", "name email");

        if (!updatedCourse) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCourse);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update course status" }, { status: 500 });
    }
}
