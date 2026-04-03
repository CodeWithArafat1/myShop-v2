
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // 1. Nodemailer Transporter তৈরি করা
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. ইমেইলের ফরম্যাট ও ডিজাইন
    const mailOptions = {
      from: process.env.EMAIL_USER, // মেইলটি আপনার সার্ভার থেকেই যাবে
      to: process.env.EMAIL_USER, // মেইলটি আপনার ইনবক্সেই রিসিভ হবে
      replyTo: email, // আপনি রিপ্লাই দিলে সরাসরি ইউজারের ইমেইলে যাবে
      subject: `New Message from ${name} - AmarShop`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #16a34a;">নতুন মেসেজ এসেছে!</h2>
          <p><strong>নাম:</strong> ${name}</p>
          <p><strong>ইমেইল:</strong> ${email}</p>
          <p><strong>মেসেজ:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${message}
          </div>
        </div>
      `,
    };

    // 3. ইমেইল সেন্ড করা
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}