import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

    // Public Routes List
    const isPublicRoute =
        nextUrl.pathname === "/" ||
        (nextUrl.pathname.startsWith("/api/courses") && !nextUrl.pathname.startsWith("/api/courses/create") && nextUrl.searchParams.get("mode") !== "my") ||
        // /api/courses/create is excluded (so it's private)
        // /api/courses?mode=my is excluded (so it's private)
        // /api/courses (list), /api/courses/[id], /api/courses/category/*, /api/courses/platform/* are public

        nextUrl.pathname === "/api/seed" ||
        nextUrl.pathname === "/api/leaderboard" ||
        nextUrl.pathname === "/api/stats"; // User wanted stats public or accessible? Admin-only route handler checks auth, so middleware pass is safer for getting 403 instead of 401 if logged in as user.

    const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
    const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin") || nextUrl.pathname.startsWith("/api/admin");

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return;
    }

    if (isDashboardRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    if (isAdminRoute) {
        // @ts-expect-error role exists in session
        const isAdmin = req.auth?.user?.role === "admin";
        if (!isAdmin) {
            if (nextUrl.pathname.startsWith("/api/")) {
                return Response.json({ error: "Forbidden" }, { status: 403 });
            }
            return Response.redirect(new URL("/dashboard", nextUrl));
        }
    }

    // Protect all /api routes by default, except public ones
    if (nextUrl.pathname.startsWith("/api/")) {
        if (!isLoggedIn && !isPublicRoute) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return;
})

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
        "/api/:path*"
    ],
};
