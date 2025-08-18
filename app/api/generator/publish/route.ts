import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateWorkoutPlan, generateFitnessImages, generateNutritionAdvice, FitnessContentRequest } from "@/lib/openai";
import { generateCourseTitle } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received request body:", body);
    
    // Извлекаем опции из body.opts или напрямую из body
    const opts = body.opts || body;
    const { weeks, sessionsPerWeek, injurySafe, specialEquipment, nutritionTips, workoutTypes, targetMuscles, gender, images, pdf } = opts;

    console.log("Extracted options:", { weeks, sessionsPerWeek, injurySafe, specialEquipment, nutritionTips, workoutTypes, targetMuscles, gender, images, pdf });

    // Валидация входных данных
    if (!weeks || !sessionsPerWeek || !workoutTypes || !targetMuscles || !gender) {
      return NextResponse.json({ 
        error: "Missing required fields", 
        received: { weeks, sessionsPerWeek, workoutTypes, targetMuscles, gender },
        required: ["weeks", "sessionsPerWeek", "workoutTypes", "targetMuscles", "gender"]
      }, { status: 400 });
    }

    // Создаем запрос для OpenAI
    const fitnessRequest: FitnessContentRequest = {
      weeks,
      sessionsPerWeek,
      injurySafe: injurySafe || false,
      specialEquipment: specialEquipment || false,
      nutritionTips: nutritionTips || false,
      workoutTypes,
      targetMuscles,
      gender,
    };

    console.log("Fitness request:", fitnessRequest);

    // Генерируем полный контент с OpenAI
    const [workoutPlan, imageUrls, nutritionAdvice] = await Promise.all([
      generateWorkoutPlan(fitnessRequest),
      images > 0 ? generateFitnessImages(fitnessRequest, images) : Promise.resolve([]),
      nutritionTips ? generateNutritionAdvice(fitnessRequest) : Promise.resolve("")
    ]);

    // Создаем полный курс
    const fullCourse = {
      title: generateCourseTitle(fitnessRequest),
      description: `Comprehensive ${weeks}-week fitness program with ${workoutTypes.join(', ')} focus on ${targetMuscles.join(', ')}`,
      options: fitnessRequest,
      content: workoutPlan,
      images: imageUrls,
      nutritionAdvice: nutritionAdvice || undefined,
      createdAt: new Date().toISOString(),
      type: "full",
      userId: session.user.email,
      pdf: pdf || "none",
    };

    // Сохраняем в базу данных (здесь нужно добавить логику сохранения)
    // TODO: Добавить сохранение в базу данных

    return NextResponse.json({
      success: true,
      course: fullCourse,
      message: "Full course generated and published successfully"
    });

  } catch (error) {
    console.error("Error publishing course:", error);
    return NextResponse.json(
      { error: "Failed to publish course" },
      { status: 500 }
    );
  }
}
