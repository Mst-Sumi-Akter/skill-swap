import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                await dbConnect();

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await User.findOne({ email }).select("+password");

                if (!user) {
                    throw new Error("Invalid credentials");
                }

                if (!user.password) {
                    throw new Error("Invalid credentials or account type");
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.photoURL
                };
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn() {
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
                token.picture = user.image;
            }
            return token;
        },
    }
});
