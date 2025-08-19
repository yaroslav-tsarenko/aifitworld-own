import { NextResponse } from "next/server";

export async function GET() {
  console.log("=== TEST API CALLED ===");
  return NextResponse.json({ 
    message: "Test API working",
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  console.log("=== TEST API POST CALLED ===");
  return NextResponse.json({ 
    message: "Test API POST working",
    timestamp: new Date().toISOString()
  });
}
