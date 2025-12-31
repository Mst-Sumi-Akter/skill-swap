import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { type NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    if (mode === "my") {
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = session.user.id;
      const courses = await Course.find({ currentOwner: userId })
        .sort({ createdAt: -1 })
        .populate("currentOwner", "name photoURL");
      return NextResponse.json(courses);
    }

    // Default: Get all available courses
    const courses = await Course.find({ status: "approved", isAvailable: true })
      .sort({ createdAt: -1 })
      .populate("currentOwner", "name photoURL email");

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, description, category, platform, thumbnailUrl } = body;

    if (!title || !description || !category || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await Course.create({
      title,
      description,
      category,
      platform,
      thumbnailUrl,
      currentOwner: session.user.id,
      status: "pending",
      isAvailable: true
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 500 });
  }
}
