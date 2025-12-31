import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { Exchange } from "@/models/Exchange";
import mongoose from "mongoose";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = session.user.id;

        // 1. Owned Courses Count
        const ownedCoursesCount = await Course.countDocuments({ currentOwner: userId });

        // 2. Pending Requests (Incoming)
        const pendingIncomingRequests = await Exchange.countDocuments({
            toUser: userId,
            status: "pending"
        });

        // 3. Total Exchanges (Completed)
        const totalExchanges = await Exchange.countDocuments({
            $or: [{ fromUser: userId }, { toUser: userId }],
            status: "accepted"
        });

        // 4. Recent Requests (Combination of incoming/outgoing)
        const recentRequests = await Exchange.find({
            $or: [{ fromUser: userId }, { toUser: userId }]
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("fromUser", "name photoURL")
            .populate("toUser", "name photoURL")
            .populate("requestedCourse", "title")
            .populate("offeredCourse", "title");

        return NextResponse.json({
            stats: {
                ownedCourses: ownedCoursesCount,
                pendingRequests: pendingIncomingRequests,
                totalExchanges: totalExchanges,
                exchangeRate: totalExchanges > 0 ? "100%" : "0%" // Placeholder logic
            },
            recentActivity: recentRequests
        });

    } catch (error: any) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
