import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { CONTACT_RECIPIENT_EMAIL, RESEND_FROM_EMAIL } from '@/lib/contact-server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function normalizeText(value: unknown, maxLength: number) {
    if (typeof value !== "string") return "";
    return value.replace(/\r/g, "").trim().slice(0, maxLength);
}

function getClientIp(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() || "unknown";
    }

    return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(clientIp: string) {
    const now = Date.now();
    const recentRequests = (requestLog.get(clientIp) ?? []).filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        requestLog.set(clientIp, recentRequests);
        return true;
    }

    recentRequests.push(now);
    requestLog.set(clientIp, recentRequests);
    return false;
}

export async function POST(request: Request) {
    try {
        const clientIp = getClientIp(request);
        if (isRateLimited(clientIp)) {
            return NextResponse.json({ error: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.' }, { status: 429 });
        }

        const { name, email, subject, message } = await request.json();
        const safeName = normalizeText(name, 120);
        const safeEmail = normalizeText(email, 254).toLowerCase();
        const safeSubject = normalizeText(subject, 160);
        const safeMessage = normalizeText(message, 5000);

        if (!safeName || !safeEmail || !safeMessage) {
            return NextResponse.json({ error: 'Lütfen gerekli alanları doldurun.' }, { status: 400 });
        }

        if (!EMAIL_REGEX.test(safeEmail)) {
            return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'E-posta servisi yapılandırılmamış.' }, { status: 500 });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: `HesapMod İletişim <${RESEND_FROM_EMAIL}>`,
            to: [CONTACT_RECIPIENT_EMAIL],
            subject: safeSubject || 'HesapMod İletişim Formu Mesajı',
            replyTo: safeEmail,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Yeni İletişim Formu Mesajı</h2>
                    <p><strong>Gönderen:</strong> ${escapeHtml(safeName)}</p>
                    <p><strong>E-posta:</strong> ${escapeHtml(safeEmail)}</p>
                    <p><strong>Konu:</strong> ${escapeHtml(safeSubject || 'Yok')}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Mesaj:</strong></p>
                    <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${escapeHtml(safeMessage)}</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data?.id });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
    }
}
