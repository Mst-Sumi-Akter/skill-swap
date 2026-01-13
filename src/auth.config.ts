import type { NextAuthConfig } from "next-auth";


export default {
    providers: [],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
