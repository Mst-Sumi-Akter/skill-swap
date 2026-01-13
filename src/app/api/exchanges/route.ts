import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Exchange } from "@/models/Exchange";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { auth } from "@/auth";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const fromUserId = session.user.id;
        const body = await req.json();
        const { requestedCourseId, offeredCourseId } = body;



        if (!requestedCourseId || !offeredCourseId) {
            return NextResponse.json({ error: "Both course IDs are required" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(requestedCourseId) || !mongoose.Types.ObjectId.isValid(offeredCourseId)) {
            return NextResponse.json({ error: "Invalid course ID format" }, { status: 400 });
        }

        const requestedCourse = await Course.findById(requestedCourseId);
        const offeredCourse = await Course.findById(offeredCourseId);

        if (!requestedCourse) {
            return NextResponse.json({ error: "Requested course not found" }, { status: 404 });
        }

        if (!offeredCourse) {
            return NextResponse.json({ error: "Offered course not found" }, { status: 404 });
        }

        // Ensure currentOwner exists
        if (!offeredCourse.currentOwner || !requestedCourse.currentOwner) {
            return NextResponse.json({ error: "Course owner data missing" }, { status: 500 });
        }

        const offeredOwnerId = offeredCourse.currentOwner.toString();
        const requestedOwnerId = requestedCourse.currentOwner.toString();

        if (offeredOwnerId !== fromUserId) {
            return NextResponse.json({
                error: "Ownership mismatch",
                details: `You do not own the offered course. Database owner: ${offeredOwnerId}, Session user: ${fromUserId}`
            }, { status: 403 });
        }

        if (requestedOwnerId === fromUserId) {
            return NextResponse.json({ error: "You cannot exchange with yourself" }, { status: 400 });
        }

        const newExchange = await Exchange.create({
            fromUser: fromUserId,
            toUser: requestedCourse.currentOwner,
            offeredCourse: offeredCourseId,
            requestedCourse: requestedCourseId,
            status: "pending",
        });


        return NextResponse.json(newExchange, { status: 201 });
    } catch (error: any) {
        console.error("CRITICAL: Create exchange error:", error);
        return NextResponse.json({
            error: "Failed to create exchange",
            message: error.message,
            type: error.name
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    // @ts-expect-error role is generic
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
    }

    await dbConnect();
    try {
        const exchanges = await Exchange.find({})
            .populate("fromUser", "name email")
            .populate("toUser", "name email")
            .populate("offeredCourse", "title")
            .populate("requestedCourse", "title")
            .sort({ createdAt: -1 });

        return NextResponse.json(exchanges);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch exchanges" }, { status: 500 });
    }
}
