import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { openai } from "@/lib/openai";
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
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
        createdAt: true,
        tokensSpent: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Получаем опции курса
    const options = typeof course.options === "string" 
      ? JSON.parse(course.options) 
      : course.options;

    // Генерируем контент через OpenAI API
    console.log("Generating content via OpenAI API for course:", course.id);
    
    // Генерируем изображения через DALL-E 3
    let courseImages: string[] = [];
    try {
      // Получаем количество изображений из опций курса
      const imageCount = options.imageCount || 2; // По умолчанию 2, если не указано
      console.log("Generating", imageCount, "images for course");
      
      // Генерируем изображения по одному с уникальными промптами
      for (let i = 0; i < imageCount; i++) {
        const typeFocus = Array.isArray(options.workoutTypes) && options.workoutTypes.length
          ? options.workoutTypes[i % options.workoutTypes.length]
          : (i % 3 === 0 ? 'strength training' : i % 3 === 1 ? 'cardio exercises' : 'mobility and flexibility');
        const muscleFocus = Array.isArray(options.targetMuscles) && options.targetMuscles.length
          ? options.targetMuscles[i % options.targetMuscles.length]
          : (i % 2 === 0 ? 'upper body' : 'lower body');

        const uniquePrompt = `Create a motivational fitness image for a ${options.weeks || 4}-week fitness program.
        Style: Modern, professional, motivational fitness photography with high contrast and clear details.
        Elements: Show fit people exercising with proper form, modern gym equipment, or outdoor fitness scenes.
        Mood: Energetic, inspiring, professional, high-quality.
        Format: High resolution, suitable for fitness program documentation, clear and crisp.
        Composition: Well-lit, professional photography style, suitable for printing.

        SPECIFIC VARIATION ${i + 1}:
        - Focus: ${typeFocus} highlighting ${muscleFocus}
        - Equipment: ${i % 4 === 0 ? 'dumbbells and resistance bands' : i % 4 === 1 ? 'cardio machines and treadmills' : i % 4 === 2 ? 'yoga mats and stability balls' : 'free weights and benches'}
        - Setting: ${i % 3 === 0 ? 'modern gym interior' : i % 3 === 1 ? 'outdoor fitness area' : 'home workout space'}
        - People: ${i % 2 === 0 ? 'diverse group of 2-3 people' : 'single focused athlete'}

        IMPORTANT: This must be completely different from any other fitness image. Unique composition, lighting, and perspective.`;
        
        try {
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: uniquePrompt,
            n: 1, // Генерируем по одному для уникальности
            size: "1024x1024",
            quality: "hd",
            style: "natural",
          });
          
          if (imageResponse.data?.[0]?.url) {
            courseImages.push(imageResponse.data[0].url);
            console.log(`Generated image ${i + 1}/${imageCount}:`, imageResponse.data[0].url);
          }
          
          // Небольшая пауза между запросами
          if (i < imageCount - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (singleImageError) {
          console.error(`Failed to generate image ${i + 1}:`, singleImageError);
        }
      }
      
      console.log("DALL-E 3 images generated successfully:", courseImages.length);
      console.log("Unique image URLs:", courseImages);
      
      // Проверяем уникальность изображений
      const uniqueImages = [...new Set(courseImages)];
      if (uniqueImages.length !== courseImages.length) {
        console.log(`Warning: Found ${courseImages.length - uniqueImages.length} duplicate images`);
        courseImages = uniqueImages;
      }
      
      // Если изображений меньше запрошенного количества, добавляем fallback
      if (courseImages.length < imageCount) {
        const missingCount = imageCount - courseImages.length;
        console.log(`Adding ${missingCount} fallback images`);
        
                 // Разнообразные fallback изображения с разных источников
         const fallbackUrls = [
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=90',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=95',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=100',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=85',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=92',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=88',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=96',
           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=87'
         ];
        
        for (let i = 0; i < missingCount; i++) {
          const fallbackUrl = fallbackUrls[i % fallbackUrls.length] + `&v=${Date.now() + i}&unique=${Math.random()}`;
          courseImages.push(fallbackUrl);
        }
        
        console.log("Added fallback images, total:", courseImages.length);
      }
      
      console.log(`Final image count: ${courseImages.length}/${imageCount} requested`);
    } catch (imageError) {
      console.error("DALL-E 3 image generation failed:", imageError);
      // Fallback изображения - генерируем разное количество с разными URL
      const fallbackCount = options.imageCount || 2;
      console.log("Using fallback images, count:", fallbackCount);
      
             // Разнообразные fallback изображения с уникальными параметрами
       const fallbackUrls = [
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=90',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=95',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=100',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=85',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=92',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=88',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=96',
         'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=87'
       ];
      
      courseImages = Array.from({ length: fallbackCount }, (_, i) => 
        fallbackUrls[i % fallbackUrls.length] + `&v=${Date.now() + i}&unique=${Math.random()}&timestamp=${Date.now()}`
      );
    }
      
      // Создаем промпт для генерации контента
    const prompt = `Create a detailed, well-structured fitness program content for a ${options.weeks || 4}-week program with ${options.sessionsPerWeek || 4} sessions per week.

    Program must reflect ALL selected preferences.
    - Workout Types: ${(Array.isArray(options.workoutTypes) && options.workoutTypes.length) ? options.workoutTypes.join(', ') : 'general fitness'}
    - Target Muscle Groups: ${(Array.isArray(options.targetMuscles) && options.targetMuscles.length) ? options.targetMuscles.join(', ') : 'balanced full body'}
    - Gender: ${options.gender || 'male'}
    - Injury-safe: ${options.injurySafe ? 'yes' : 'no'}
    - Special equipment: ${options.specialEquipment ? 'yes' : 'no'}

    CRITICAL: Generate ONLY clean HTML content without any markdown formatting. Do NOT use \`\`\`html or any markdown syntax.
    
    Use these HTML tags directly:
    - <h2> for main sections
    - <h3> for subsections  
    - <strong> for important text
    - <ul> and <li> for lists
    - <table> with <tr>, <th>, <td> for exercise tables
    - <div class="highlight-box"> for important tips
    - <p> for paragraphs
    
    Include these sections:
    
    <h2>Program Overview</h2>
    <p>Brief description of the program goals and structure.</p>
    
    <h2>Weekly Breakdown</h2>
    <h3>Session 1: [Type] Training</h3>
    <h3>Session 2: [Type] Training</h3>
    (Continue for all sessions)
    
    <h2>Session Details</h2>
    For each session, include:
    <h3>Warm-Up (10 minutes)</h3>
    <ul>
      <li>Dynamic Stretching exercises</li>
      <li>Light Cardio</li>
    </ul>
    
    <h3>Main Workout (45 minutes)</h3>
    <table class="exercise-table">
      <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th></tr>
      <tr><td>Exercise name</td><td>3</td><td>10-12</td><td>60s</td></tr>
    </table>
    
    <h3>Cool-Down (10 minutes)</h3>
    <ul>
      <li>Static Stretching</li>
      <li>Deep Breathing</li>
    </ul>
    
    <h2>Progressive Overload Principles</h2>
    <p>How to increase intensity over time.</p>
    
    <h2>Safety Tips and Form Cues</h2>
    <ul>
      <li>Important safety information</li>
    </ul>
    
    ${options.injurySafe ? '<h2>Injury-Safe Modifications and Alternatives</h2>\n<ul><li>Provide safe alternatives for exercises</li></ul>' : ''}
    
    ${options.nutritionTips ? '<h2>Nutrition Advice for the Week</h2>\n<p>Include hydration, pre/post workout nutrition, and meal timing.</p>' : ''}
    
    ${options.specialEquipment ? '<h2>Equipment Requirements and Alternatives</h2>\n<p>List required equipment and home alternatives.</p>' : ''}
    
    <h2>Conclusion</h2>
    <p>Summary and encouragement.</p>
    
    <div class="highlight-box">
      <h4>Important Disclaimer</h4>
      <p>Always consult a healthcare professional before starting any new fitness program.</p>
    </div>
    
    Generate ONLY clean HTML without any markdown formatting or code blocks.`;

      // Генерируем контент через OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer. Create detailed, safe, and effective workout plans. Always prioritize safety and proper form. Provide structured content that can be easily formatted for PDF."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

    const generatedContent = completion.choices[0]?.message?.content || "Failed to generate content";
      console.log("OpenAI content generated successfully");

    // Очищаем контент от markdown и лишних символов
    const cleanContent = generatedContent
      .replace(/```html\s*/g, '') // Убираем ```html
      .replace(/```\s*$/g, '') // Убираем ``` в конце
      .replace(/^\s*```\s*/g, '') // Убираем ``` в начале
      .replace(/\n\s*\n/g, '\n') // Убираем двойные переносы
      .trim(); // Убираем лишние пробелы

    // Функция для умного распределения изображений по контенту
    const distributeImagesInContent = (content: string, images: string[]) => {
      if (images.length <= 3) return content;
      
      const remainingImages = images.slice(3);
      console.log(`Distributing ${remainingImages.length} remaining images throughout content`);
      
      // Простое решение: добавляем все изображения в конец контента
      const additionalImagesHtml = `
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h2>Additional Program Visuals</h2>
          <p style="color: #666; margin-bottom: 20px;">${remainingImages.length} motivational fitness images to inspire your journey</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            ${remainingImages.map((img, index) => `
              <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <img src="${img}" alt="Fitness motivation ${index + 4}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 10px;" />
                <p style="font-size: 12px; color: #888; font-style: italic;">Motivational fitness scene ${index + 4}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      return content + additionalImagesHtml;
    };
    
    // Применяем распределение изображений
    const enhancedContent = distributeImagesInContent(cleanContent, courseImages);
    
    console.log(`Content enhanced with images. Total images: ${courseImages.length}`);
    console.log(`First 3 images shown in header, ${courseImages.length - 3} distributed throughout content`);

    // Создаем HTML контент для PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${course.title || 'Fitness Program'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background: #f8f9fa;
              padding: 20px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            .title { 
              font-size: 32px; 
              font-weight: 700; 
              margin-bottom: 15px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .subtitle { 
              font-size: 18px; 
              opacity: 0.9;
              font-weight: 300;
            }
            .content { 
              padding: 40px;
              font-size: 16px;
            }
            .content h2 {
              color: #667eea;
              font-size: 24px;
              margin: 30px 0 15px 0;
              font-weight: 600;
              border-bottom: 2px solid #667eea;
              padding-bottom: 8px;
            }
            .content h3 {
              color: #555;
              font-size: 20px;
              margin: 25px 0 12px 0;
              font-weight: 600;
            }
            .content p {
              margin-bottom: 15px;
              line-height: 1.7;
            }
            .exercise-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .exercise-table th {
              background: #667eea;
              color: white;
              padding: 15px;
              text-align: left;
              font-weight: 600;
            }
            .exercise-table td {
              padding: 15px;
              border-bottom: 1px solid #eee;
            }
            .exercise-table tr:nth-child(even) {
              background: #f8f9fa;
            }
            .highlight-box {
              background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
              padding: 25px;
              border-radius: 8px;
              margin: 25px 0;
              border-left: 4px solid #fdcb6e;
            }
            .highlight-box h4 {
              color: #2d3436;
              margin-bottom: 12px;
              font-size: 18px;
            }
            .content ul, .content ol {
              margin: 15px 0 15px 25px;
            }
            .content li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
            .course-images {
              margin-bottom: 30px;
            }
            .image-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            .image-container {
              text-align: center;
              background: white;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .course-image {
              width: 100%;
              height: auto;
              border-radius: 6px;
              margin-bottom: 10px;
            }
            .image-caption {
              font-size: 14px;
              color: #666;
              font-style: italic;
            }
            
            .footer {
              background: #2d3436;
              color: white;
              text-align: center;
              padding: 20px;
              font-size: 14px;
              opacity: 0.8;
            }
            @media print {
              body { background: white; }
              .container { box-shadow: none; }
              .header { background: #667eea !important; }
              .content h2 { page-break-after: avoid; }
              .content h3 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">${course.title || 'Fitness Program'}</div>
              <div class="subtitle">Generated on ${new Date(course.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div class="content">
              ${courseImages.length > 0 ? `
                <div class="course-images">
                  <h2>Program Visuals (${courseImages.length} total images)</h2>
                  <div class="image-grid">
                    ${courseImages.slice(0, Math.min(3, courseImages.length)).map((img, index) => `
                      <div class="image-container">
                        <img src="${img}" alt="Fitness motivation ${index + 1}" class="course-image" />
                        <p class="image-caption">Motivational fitness scene ${index + 1}</p>
                      </div>
                    `).join('')}
                  </div>
                  ${courseImages.length > 3 ? `<p style="text-align: center; color: #666; font-style: italic;">+ ${courseImages.length - 3} more images distributed throughout the program</p>` : ''}
                </div>
              ` : ''}
              ${enhancedContent}
              
            </div>
            
            <div class="footer">
              <p>Generated by AI Fitness Coach • Always consult a healthcare professional before starting any new fitness program</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    console.log(`HTML content created with ${courseImages.length} images`);
    console.log(`First 3 images: ${courseImages.slice(0, 3).length}`);
    console.log(`Remaining images: ${courseImages.slice(3).length}`);

    // Создаем уникальный ID для файла
    const filename = `course-${courseId}-${Date.now()}.pdf`;
    
    // Конвертируем HTML в PDF
    let pdfBuffer;
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      
      const page = await browser.newPage();
      
      // Включаем загрузку изображений
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() === 'image') {
          req.continue();
        } else {
          req.continue();
        }
      });
      
      // Загружаем HTML контент
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Ждем загрузки стилей и изображений
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Дополнительно ждем загрузки всех изображений
      try {
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('img');
          return Array.from(images).every(img => img.complete && img.naturalHeight > 0);
        }, { timeout: 10000 });
        console.log("All images loaded successfully");
      } catch (imageWaitError) {
        console.log("Some images may not have loaded:", imageWaitError);
      }
      
      // Генерируем PDF с простыми настройками
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      console.log("PDF generated successfully with Puppeteer, size:", pdfBuffer.length);
      
      // Проверяем что PDF не пустой
      if (pdfBuffer.length < 1000) {
        throw new Error('Generated PDF is too small, likely corrupted');
      }
      
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Fallback к HTML если PDF не удался
      console.log("Falling back to HTML generation");
      
      // Создаем HTML URL как fallback
      const htmlDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      
      // Обновляем курс с HTML URL
      await prisma.course.update({
        where: { id: courseId },
        data: { pdfUrl: htmlDataUrl },
      });

      return NextResponse.json({
        success: true,
        pdfUrl: htmlDataUrl,
        filename: `course-${courseId}-${Date.now()}.html`,
        htmlContent: htmlContent,
        fallback: true,
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error'
      });
    }
    
    // Создаем data URL для PDF
    const pdfDataUrl = `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString('base64')}`;
    
    // Проверяем размер и валидность
    console.log("PDF Buffer size:", pdfBuffer.length);
    console.log("PDF Buffer first 100 bytes:", pdfBuffer.slice(0, 100));
    console.log("PDF starts with PDF header:", Buffer.from(pdfBuffer.slice(0, 4)).toString() === '%PDF');
    
    // Обновляем курс с PDF URL
    await prisma.course.update({
      where: { id: courseId },
      data: { pdfUrl: pdfDataUrl },
    });

    return NextResponse.json({
      success: true,
      pdfUrl: pdfDataUrl,
      filename,
      htmlContent: htmlContent,
      pdfSize: pdfBuffer.length,
      pdfHeader: Buffer.from(pdfBuffer.slice(0, 10)).toString('hex'),
      debugInfo: {
        totalImages: courseImages.length,
        imagesInHeader: Math.min(3, courseImages.length),
        imagesDistributed: courseImages.length - Math.min(3, courseImages.length),
        imageUrls: courseImages.slice(0, 5), // Первые 5 URL для проверки
        contentLength: enhancedContent.length,
        hasImages: courseImages.length > 0
      }
    });

  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
