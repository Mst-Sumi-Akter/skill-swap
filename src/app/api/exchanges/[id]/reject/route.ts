import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Exchange } from "@/models/Exchange";
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
        const exchange = await Exchange.findById(id);

        if (!exchange) {
            return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
        }

        if (exchange.toUser.toString() !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (exchange.status !== "pending") {
            return NextResponse.json({ error: "Exchange is not pending" }, { status: 400 });
        }

        exchange.status = "rejected";
        await exchange.save();

        return NextResponse.json({ message: "Exchange rejected" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to reject exchange" }, { status: 500 });
    }
}
