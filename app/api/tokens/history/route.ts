import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "20"), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? "0"), 0);

  const items = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const payload = items.map((i: (typeof items)[number]) => {
     let meta: unknown = null;
     if (i.meta) {
       try { meta = JSON.parse(i.meta); } catch { meta = i.meta; }
     }
     return {
       id: i.id,
       type: i.type,
       amount: i.amount,
       createdAt: i.createdAt.toISOString(),
       meta,
     };
   });
   return Response.json({ items: payload });
}
