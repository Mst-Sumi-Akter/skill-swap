import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Exchange } from "@/models/Exchange";
import { User } from "@/models/User";

export async function GET() {
    await dbConnect();
    try {

        const leaderboard = await Exchange.aggregate([
            { $match: { status: "accepted" } },
            {
                $facet: {
                    senders: [{ $group: { _id: "$fromUser", count: { $sum: 1 } } }],
                    receivers: [{ $group: { _id: "$toUser", count: { $sum: 1 } } }]
                }
            },
            { $project: { all: { $concatArrays: ["$senders", "$receivers"] } } },
            { $unwind: "$all" },
            { $group: { _id: "$all._id", totalExchanges: { $sum: "$all.count" } } },
            { $sort: { totalExchanges: -1 } },
            { $limit: 10 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { _id: 1, totalExchanges: 1, name: "$user.name", photoURL: "$user.photoURL" } }
        ]);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
