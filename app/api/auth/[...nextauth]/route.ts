// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs";          // ВАЖНО: Prisma/NextAuth нужны Node, не Edge
export const dynamic = "force-dynamic";   // избегаем кеша/статической отдачи

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
