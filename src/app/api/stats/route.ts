import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { Exchange } from "@/models/Exchange";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    // const session = await auth();
    // if (!session) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    await dbConnect();
    try {
        const [totalUsers, totalCourses, totalExchanges, pendingCourses] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Exchange.countDocuments(),
            Course.countDocuments({ status: "pending" })
        ]);

        return NextResponse.json({
            totalUsers,
            totalCourses,
            totalExchanges,
            pendingCourses
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
