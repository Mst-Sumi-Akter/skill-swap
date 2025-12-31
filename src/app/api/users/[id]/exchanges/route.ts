import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Exchange } from "@/models/Exchange";
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        // Optional: Allow admin? For now simple privacy
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requesterId = session.user.id;

    await dbConnect();
    try {
        const { id } = await params;

        if (requesterId !== id) {
            // Strict privacy: only view own exchanges
            // return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const exchanges = await Exchange.find({
            $or: [{ fromUser: id }, { toUser: id }]
        })
            .populate("fromUser", "name email photoURL")
            .populate("toUser", "name email photoURL")
            .populate("offeredCourse", "title thumbnailUrl platform")
            .populate("requestedCourse", "title thumbnailUrl platform")
            .sort({ createdAt: -1 });

        return NextResponse.json(exchanges);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user exchanges" }, { status: 500 });
    }
}
