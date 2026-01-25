import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'SAVED <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: '📩 New message – SAVED',
      html: `
        <h2>New message received</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
