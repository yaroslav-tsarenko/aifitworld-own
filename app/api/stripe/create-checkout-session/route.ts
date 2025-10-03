export const runtime = 'edge';
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Payments are not configured. Use /api/tokens/topup for instant credit.' }),
    { status: 501, headers: { 'content-type': 'application/json' } }
  );
}
