import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("=== TESTING DATABASE CONNECTION ===");
    
    // Проверяем подключение к базе
    await prisma.$connect();
    console.log("✅ Database connection successful");
    
    // Пробуем простой запрос
    const userCount = await prisma.user.count();
    console.log("✅ User count query successful:", userCount);
    
    // Пробуем запрос к таблице Transaction
    const transactionCount = await prisma.transaction.count();
    console.log("✅ Transaction count query successful:", transactionCount);
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: "Database connection and queries successful",
      userCount,
      transactionCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("=== DATABASE TEST FAILED ===", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
