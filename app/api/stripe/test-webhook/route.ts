import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("=== TEST WEBHOOK ENDPOINT ===");
  
  try {
    const body = await req.text();
    console.log("Test webhook body:", body);
    
    // Парсим JSON
    const event = JSON.parse(body);
    console.log("Test webhook event:", event);
    
    // Имитируем обработку webhook
    if (event.type === "checkout.session.completed") {
      console.log("Test: Processing completed checkout session");
      console.log("Test: Session metadata:", event.data.object.metadata);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Test webhook processed",
      event: event 
    });
    
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json({ 
      error: "Failed to process test webhook" 
    }, { status: 500 });
  }
}
