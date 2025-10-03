export const runtime = 'edge';
export async function GET() {
  return new Response(
    JSON.stringify({ error: 'Payments are not configured. No session info available.' }),
    { status: 501, headers: { 'content-type': 'application/json' } }
  );
}
