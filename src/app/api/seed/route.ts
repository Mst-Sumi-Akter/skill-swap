import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    await dbConnect();

    try {
        // 1. Create a dummy user to own these courses if not exists
        let user = await User.findOne({ email: "moon@gmail.com" });
        if (!user) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({
                name: "Moon",
                email: "moon@gmail.com",
                password: hashedPassword,
                photoURL: "https://via.placeholder.com/150",
                role: "admin",
            });
        } else {
            // Ensure the name is Moon
            user.name = "Moon";
            await user.save();
        }

        const userId = user._id;

        // 2. Define the courses data
        const courses = [
            {
                title: "UI/UX Design Principles",
                description: "Learn UI and UX design fundamentals for real projects.",
                platform: "LinkedIn Learning",
                category: "Design",
                isAvailable: true,
                currentOwner: userId,
                exchangeCount: 0,
                status: "approved",
                thumbnailUrl: "https://www.nickelfox.com/wp-content/uploads/2022/01/UI_UXHero.jpg",
            },
            {
                title: "React Native Mobile Apps",
                description: "Build cross-platform mobile apps using React Native.",
                platform: "Udemy",
                category: "Mobile Development",
                isAvailable: true,
                currentOwner: userId,
                exchangeCount: 0,
                status: "approved",
                thumbnailUrl: "https://cdn.prod.website-files.com/64419b7d8385c10f0fb4c7d7/65281818be46872584524cbf_63eea67570417257c704f056_React-Native-.png", // Fixed truncated URL possibility
            },
            {
                title: "Introduction to SQL",
                description: "Learn SQL queries, joins, and database design concepts.",
                platform: "edX",
                category: "Database",
                isAvailable: true,
                currentOwner: userId,
                exchangeCount: 0,
                status: "approved",
                thumbnailUrl: "https://blob.sololearn.com/assets/introduction-sql-web-og-v1.png",
            },
        ];

        // 3. Clear existing courses (Optional: decided to just add for now, or maybe check duplicates?)
        // Let's just create them. To avoid duplicates, we can check by title.

        const createdCourses = [];
        for (const courseData of courses) {
            const existing = await Course.findOne({ title: courseData.title });
            if (!existing) {
                const newCourse = await Course.create(courseData);
                createdCourses.push(newCourse);
            } else {
                // Update owner to ensure it's the correct "Moon" user
                existing.currentOwner = userId;
                await existing.save();
                createdCourses.push(existing);
            }
        }

        // 4. Aggressive fix: Find ANY course that is missing a currentOwner and assign it to Moon
        const orphanedCourses = await Course.updateMany(
            { currentOwner: { $exists: false } },
            { $set: { currentOwner: userId } }
        );

        const nullOwnerCourses = await Course.updateMany(
            { currentOwner: null },
            { $set: { currentOwner: userId } }
        );

        return NextResponse.json({
            message: "Database seeded and owners synchronized successfully",
            createdOrUpdated: createdCourses.length,
            orphanedFixed: orphanedCourses.modifiedCount,
            nullFixed: nullOwnerCourses.modifiedCount,
            seededUser: user.email
        });

    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
