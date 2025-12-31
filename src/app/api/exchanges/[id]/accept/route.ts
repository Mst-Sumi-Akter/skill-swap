import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Exchange } from "@/models/Exchange";
import { Course } from "@/models/Course";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await dbConnect();
    const { id } = await params;

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
        const exchange = await Exchange.findById(id).session(mongoSession);
        if (!exchange) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
        }

        if (exchange.toUser.toString() !== userId) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: "You are not authorized to accept this exchange" }, { status: 403 });
        }

        if (exchange.status !== "pending") {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: "Exchange is not pending" }, { status: 400 });
        }

        // Perform the swap
        const offeredCourse = await Course.findById(exchange.offeredCourse).session(mongoSession);
        const requestedCourse = await Course.findById(exchange.requestedCourse).session(mongoSession);

        if (!offeredCourse || !requestedCourse) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: "One or both courses not found" }, { status: 404 });
        }

        // Verify ownership again to be safe
        if (offeredCourse.currentOwner.toString() !== exchange.fromUser.toString() ||
            requestedCourse.currentOwner.toString() !== exchange.toUser.toString()) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: "Ownership mismatch, cannot swap" }, { status: 400 });
        }

        // Swap owners
        offeredCourse.currentOwner = exchange.toUser;
        requestedCourse.currentOwner = exchange.fromUser;

        // Increment exchange counts
        offeredCourse.exchangeCount += 1;
        requestedCourse.exchangeCount += 1;

        await offeredCourse.save({ session: mongoSession });
        await requestedCourse.save({ session: mongoSession });

        // Update exchange status
        exchange.status = "accepted";
        await exchange.save({ session: mongoSession });

        await mongoSession.commitTransaction();
        return NextResponse.json({ message: "Exchange accepted and courses swapped" });
    } catch (error) {
        await mongoSession.abortTransaction();
        console.error("Accept exchange error:", error);
        return NextResponse.json({ error: "Failed to accept exchange" }, { status: 500 });
    } finally {
        mongoSession.endSession();
    }
}
