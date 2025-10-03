export const runtime = 'edge';
export async function POST() {
  return new Response(
    JSON.stringify({ success: true, message: 'Payments test webhook disabled' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
