import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, dayNumber, weekNumber } = body;

    if (!courseId || dayNumber === undefined || weekNumber === undefined) {
      return NextResponse.json({ 
        error: "Course ID, day number, and week number are required" 
      }, { status: 400 });
    }

    // Получаем курс из базы данных
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        options: true,
        tokensSpent: true,
        content: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Получаем опции курса
    const options = typeof course.options === "string" 
      ? JSON.parse(course.options) 
      : course.options;

    // Проверяем баланс токенов пользователя
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Получаем текущий баланс токенов
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      select: { type: true, amount: true },
    });

    const balance = transactions.reduce((acc, tx) => {
      if (tx.type === "topup") return acc + tx.amount;
      if (tx.type === "spend") return acc - tx.amount;
      return acc;
    }, 0);

    // Стоимость регенерации дня = стоимость полного курса
    const regenerationCost = course.tokensSpent;

    if (balance < regenerationCost) {
      return NextResponse.json({ 
        error: "Insufficient tokens", 
        required: regenerationCost,
        balance: balance 
      }, { status: 402 });
    }

    // Создаем промпт для регенерации конкретного дня
    const prompt = `Regenerate ONLY the workout plan for Week ${weekNumber}, Day ${dayNumber} of a ${options.weeks || 4}-week fitness program.

    CRITICAL: Generate ONLY clean HTML content without any markdown formatting. Do NOT use \`\`\`html or any markdown syntax.
    
    Use these HTML tags directly:
    - <h3> for the day title
    - <h4> for subsections (Warm-Up, Main Workout, Cool-Down)
    - <strong> for important text
    - <ul> and <li> for lists
    - <table> with <tr>, <th>, <td> for exercise tables
    - <div class="highlight-box"> for important tips
    - <p> for paragraphs
    
    Generate ONLY the content for this specific day:
    
    <h3>Week ${weekNumber}, Day ${dayNumber}: [Type] Training</h3>
    
    <h4>Warm-Up (10 minutes)</h4>
    <ul>
      <li>Dynamic Stretching exercises</li>
      <li>Light Cardio</li>
    </ul>
    
    <h4>Main Workout (45 minutes)</h4>
    <table class="exercise-table">
      <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th></tr>
      <tr><td>Exercise name</td><td>3</td><td>10-12</td><td>60s</td></tr>
    </table>
    
    <h4>Cool-Down (10 minutes)</h4>
    <ul>
      <li>Static Stretching</li>
      <li>Deep Breathing</li>
    </ul>
    
    Generate ONLY clean HTML without any markdown formatting or code blocks.`;

    // Генерируем контент через OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness trainer. Create detailed, safe, and effective workout plans for specific days. Always prioritize safety and proper form. Provide structured content that can be easily formatted for PDF."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0]?.message?.content || "Failed to generate content";

    // Очищаем контент от markdown
    const cleanContent = generatedContent
      .replace(/```html\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/^\s*```\s*/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Списываем токены
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "spend",
        amount: regenerationCost,
        meta: JSON.stringify({
          reason: `Regenerated Week ${weekNumber}, Day ${dayNumber}`,
          courseId: courseId,
          operation: "regenerate_day"
        })
      }
    });

    // Обновляем курс с новым контентом
    await prisma.course.update({
      where: { id: courseId },
      data: { 
        content: cleanContent,
        tokensSpent: course.tokensSpent + regenerationCost
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully regenerated Week ${weekNumber}, Day ${dayNumber}`,
      newContent: cleanContent,
      tokensSpent: regenerationCost,
      newTotalSpent: course.tokensSpent + regenerationCost
    });

  } catch (error) {
    console.error("Day regeneration failed:", error);
    return NextResponse.json(
      { error: "Failed to regenerate day" },
      { status: 500 }
    );
  }
}


