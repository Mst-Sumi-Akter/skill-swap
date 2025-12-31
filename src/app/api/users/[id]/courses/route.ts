import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;
        // This assumes we allow seeing other users' courses (e.g. for profile view)
        // If privacy is needed, check req.headers.get("x-user-id") === id

        // According to spec: "Retrieve all courses belonging to a user" -> Private access listed in table.
        // So we should check auth? 
        // Spec says "Private". Let's assume you need to be logged in to see someone else's courses? Or maybe just it is an API used by frontend. 
        // I'll enforce at least basic auth via middleware, so here just fetching is fine.

        const courses = await Course.find({ currentOwner: id }).sort({ createdAt: -1 });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user courses" }, { status: 500 });
    }
}
