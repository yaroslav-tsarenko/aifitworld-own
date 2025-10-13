export const runtime = 'edge';

export async function POST() {
  // Placeholder webhook endpoint for future PSP integrations
  return new Response(
    JSON.stringify({ received: true, provider: process.env.PAYMENT_PROVIDER || 'none' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: 'Payments webhook placeholder', provider: process.env.PAYMENT_PROVIDER || 'none' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}

