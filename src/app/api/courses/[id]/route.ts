import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { auth } from "@/auth";

// Get Single Course (Public)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
        }

        const course = await Course.findById(id).populate("currentOwner", "name photoURL email");

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
    }
}

// Update Course (Protected)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        if (course.currentOwner.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized: You do not own this course" }, { status: 403 });
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedCourse);

    } catch (error) {
        return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }
}

// Delete Course (Protected)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
            return NextResponse.json({ error: "Unauthorized: You do not own this course" }, { status: 403 });
        }

        await Course.findByIdAndDelete(id);
        return NextResponse.json({ message: "Course deleted successfully" });

    } catch (error) {
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}
