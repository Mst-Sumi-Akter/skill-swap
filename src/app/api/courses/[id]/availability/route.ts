import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await dbConnect();
    try {
        const { id } = await params;
        const course = await Course.findById(id);

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        if (course.currentOwner.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        course.isAvailable = !course.isAvailable;
        await course.save();

        return NextResponse.json({ message: "Availability updated", isAvailable: course.isAvailable });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
    }
}
