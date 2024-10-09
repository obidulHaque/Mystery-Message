import NextAuth from "next-auth/next";
import { authProvider } from "./option";

const handler = NextAuth(authProvider);

export { handler as GET, handler as POST };
