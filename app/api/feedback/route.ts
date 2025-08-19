import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("=== FEEDBACK API CALLED ===");
  try {
    const { name, email, message, page } = await req.json();
    console.log("Received data:", { name, email, message, page });

    // Создаем транспортер
    console.log("SMTP Config:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? "***" : "NOT SET"
    });
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true для 465, false для других портов
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Отправляем письмо
    await transporter.sendMail({
      from: `"AIFitWorld Contact Form" <info@aifitworld.co.uk>`,
      to: "info@aifitworld.co.uk",
      replyTo: `"${name}" <${email}>`,
      subject: `Новое сообщение с сайта - ${page}`,
      html: `
        <h3>Новое сообщение с сайта</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Страница:</strong> ${page}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Для ответа используйте: ${email}</em></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}