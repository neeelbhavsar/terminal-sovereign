import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ─── Validation & Security Utilities ────────────────────────────────────── */

/** Validate email format */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/** Sanitize user input to prevent XSS in email templates */
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/** Simple in-memory rate limiter (consider Redis for production) */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour per IP

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 1000 / 60);
    return {
      allowed: false,
      message: `Too many requests. Please try again in ${minutesLeft} minutes.`,
    };
  }

  record.count++;
  return { allowed: true };
}

/** Validate environment variables */
function validateEnvironment(): { valid: boolean; error?: string } {
  if (!process.env.GMAIL_USER) {
    return { valid: false, error: "GMAIL_USER environment variable is not set" };
  }
  if (!process.env.GMAIL_APP_PASSWORD) {
    return { valid: false, error: "GMAIL_APP_PASSWORD environment variable is not set" };
  }
  return { valid: true };
}

/* ─── Email HTML builders ───────────────────────────────────────────────── */

const CYAN  = "#00f0ff";
const GREEN = "#00ff41";
const BG    = "#050505";
const PANEL = "#0d1117";
const BORDER = "#1a2a2a";

/** Email Neel receives when someone fills the form */
function buildOwnerEmail(name: string, email: string, message: string, ts: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Courier New',Courier,monospace;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${PANEL};border:1px solid ${BORDER};">

      <!-- ── Window chrome ── -->
      <tr>
        <td style="background:#0a0f14;padding:10px 16px;border-bottom:1px solid ${BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff5f57;margin-right:6px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ffbd2e;margin-right:6px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#28c840;"></span>
              </td>
              <td align="center" style="color:#4b5563;font-size:11px;letter-spacing:2px;">
                portfolio-mailer — incoming_request.log
              </td>
              <td align="right" style="color:${GREEN};font-size:11px;">[NEW]</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Header banner ── -->
      <tr>
        <td style="padding:0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#080e0e;border-bottom:2px solid ${CYAN};">
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 4px;color:${GREEN};font-size:11px;letter-spacing:3px;text-transform:uppercase;">
                  // event: inbound_contact_request
                </p>
                <h1 style="margin:0;font-size:22px;color:${CYAN};letter-spacing:2px;text-shadow:0 0 20px ${CYAN}66;">
                  NEW_MESSAGE_RECEIVED
                </h1>
                <p style="margin:6px 0 0;color:#4b5563;font-size:11px;">
                  ${ts}
                </p>
              </td>
              <td align="right" style="padding:28px 32px;">
                <div style="border:1px solid ${GREEN}33;background:${GREEN}11;padding:6px 12px;display:inline-block;">
                  <span style="color:${GREEN};font-size:10px;letter-spacing:2px;">● ONLINE</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Request metadata ── -->
      <tr>
        <td style="padding:28px 32px 16px;">
          <p style="margin:0 0 14px;color:#4b5563;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${BORDER};padding-bottom:8px;">
            // request_headers
          </p>

          <!-- FROM -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr style="border-bottom:1px solid ${BORDER};">
              <td style="padding:12px 0;color:${CYAN};font-size:10px;letter-spacing:2px;width:130px;text-transform:uppercase;">
                X-Sender-Name
              </td>
              <td style="padding:12px 0;color:#e2e8f0;font-size:14px;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid ${BORDER};">
              <td style="padding:12px 0;color:${CYAN};font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                X-Sender-Email
              </td>
              <td style="padding:12px 0;">
                <a href="mailto:${email}" style="color:${GREEN};font-size:13px;text-decoration:none;">${email}</a>
              </td>
            </tr>
            <tr style="border-bottom:1px solid ${BORDER};">
              <td style="padding:12px 0;color:${CYAN};font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                X-Method
              </td>
              <td style="padding:12px 0;">
                <span style="background:${GREEN}18;border:1px solid ${GREEN}44;color:${GREEN};font-size:10px;padding:3px 8px;letter-spacing:1px;">POST</span>
                <span style="color:#4b5563;font-size:11px;margin-left:8px;">/api/contact</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:${CYAN};font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                X-Status
              </td>
              <td style="padding:12px 0;">
                <span style="background:${CYAN}18;border:1px solid ${CYAN}44;color:${CYAN};font-size:10px;padding:3px 8px;letter-spacing:1px;">200 OK</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Message body ── -->
      <tr>
        <td style="padding:0 32px 28px;">
          <p style="margin:0 0 14px;color:#4b5563;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${BORDER};padding-bottom:8px;">
            // request_body
          </p>
          <div style="background:#080e0e;border-left:2px solid ${CYAN};padding:20px 20px;color:#cbd5e1;font-size:14px;line-height:1.75;white-space:pre-wrap;">
            <span style="color:${GREEN};font-size:11px;display:block;margin-bottom:10px;">&gt; message payload:</span>${message}
          </div>
        </td>
      </tr>

      <!-- ── Log output ── -->
      <tr>
        <td style="padding:0 32px 28px;">
          <p style="margin:0 0 12px;color:#4b5563;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${BORDER};padding-bottom:8px;">
            // system_log
          </p>
          <p style="margin:0 0 4px;color:${GREEN};font-size:11px;">[INFO] Contact form submitted — validation: PASSED</p>
          <p style="margin:0 0 4px;color:${GREEN};font-size:11px;">[INFO] Email dispatched to neelbhavsar124@gmail.com</p>
          <p style="margin:0 0 4px;color:${CYAN};font-size:11px;">[INFO] Auto-reply sent to ${email}</p>
          <p style="margin:0;color:#4b5563;font-size:11px;">[INFO] Total processing time: &lt;200ms</p>
        </td>
      </tr>

      <!-- ── CTA ── -->
      <tr>
        <td style="padding:0 32px 32px;" align="center">
          <a href="mailto:${email}?subject=Re: Your message from Neel's Portfolio"
            style="display:inline-block;border:1px solid ${CYAN};background:${CYAN}18;color:${CYAN};text-decoration:none;padding:12px 32px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;">
            $ reply --to ${name}
          </a>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="padding:16px 32px;border-top:1px solid ${BORDER};background:#080e0e;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#2d3748;font-size:10px;letter-spacing:1px;">
                portfolio.neelbhavsar.dev // automated notification
              </td>
              <td align="right" style="color:${GREEN};font-size:10px;">
                ● SYSTEM_ONLINE
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>
  `.trim();
}

/** Auto-reply email sent to the person who contacted Neel */
function buildAutoReplyEmail(name: string, previewMessage: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};font-family:'Courier New',Courier,monospace;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${PANEL};border:1px solid ${BORDER};">

      <!-- ── Window chrome ── -->
      <tr>
        <td style="background:#0a0f14;padding:10px 16px;border-bottom:1px solid ${BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff5f57;margin-right:6px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ffbd2e;margin-right:6px;"></span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#28c840;"></span>
              </td>
              <td align="center" style="color:#4b5563;font-size:11px;letter-spacing:2px;">
                neel@portfolio ~ $ send --auto-reply
              </td>
              <td align="right" style="color:${GREEN};font-size:11px;">200 OK</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Acknowledgement header ── -->
      <tr>
        <td style="background:#04100a;border-bottom:2px solid ${GREEN};padding:32px;">
          <p style="margin:0 0 4px;color:${GREEN};font-size:10px;letter-spacing:3px;text-transform:uppercase;">
            // response: 201_CREATED
          </p>
          <h1 style="margin:0 0 8px;font-size:24px;color:#ffffff;letter-spacing:1px;">
            Message <span style="color:${GREEN};">Received.</span>
          </h1>
          <p style="margin:0;color:#4b5563;font-size:12px;letter-spacing:1px;">
            REQUEST_ID: msg_${Date.now().toString(36).toUpperCase()}
          </p>
        </td>
      </tr>

      <!-- ── Body ── -->
      <tr>
        <td style="padding:32px;">

          <!-- Greeting -->
          <p style="margin:0 0 8px;color:${GREEN};font-size:11px;letter-spacing:2px;">
            &gt; initializing_response.sh
          </p>
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:15px;line-height:1.7;">
            Hi <strong style="color:${CYAN};">${name}</strong>,
          </p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.8;">
            Your message has been queued and delivered to my inbox.
            I typically respond within <strong style="color:#e2e8f0;">24 hours</strong> — you'll hear from me soon.
          </p>

          <!-- Echo back -->
          <div style="background:#080e0e;border-left:2px solid ${GREEN};padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;color:#4b5563;font-size:10px;letter-spacing:2px;text-transform:uppercase;">// your_message (echo)</p>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.7;font-style:italic;">&ldquo;${previewMessage}&rdquo;</p>
          </div>

          <!-- While you wait -->
          <p style="margin:0 0 12px;color:#4b5563;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${BORDER};padding-bottom:8px;">
            // while_you_wait
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 8px 0 0;width:50%;vertical-align:top;">
                <a href="https://github.com/neeelbhavsar" style="display:block;border:1px solid ${BORDER};background:#080e0e;padding:16px;text-decoration:none;color:inherit;">
                  <p style="margin:0 0 4px;color:${CYAN};font-size:10px;letter-spacing:2px;">GET /api/github</p>
                  <p style="margin:0;color:#e2e8f0;font-size:13px;">View my code →</p>
                </a>
              </td>
              <td style="padding:0 0 0 8px;width:50%;vertical-align:top;">
                <a href="https://linkedin.com/in/neeelbhavsar" style="display:block;border:1px solid ${BORDER};background:#080e0e;padding:16px;text-decoration:none;color:inherit;">
                  <p style="margin:0 0 4px;color:${GREEN};font-size:10px;letter-spacing:2px;">GET /api/linkedin</p>
                  <p style="margin:0;color:#e2e8f0;font-size:13px;">Connect with me →</p>
                </a>
              </td>
            </tr>
          </table>

          <!-- Sign-off -->
          <p style="margin:28px 0 0;color:#4b5563;font-size:10px;letter-spacing:3px;text-transform:uppercase;border-bottom:1px solid ${BORDER};padding-bottom:8px;">
            // signature
          </p>
          <p style="margin:16px 0 0;color:#94a3b8;font-size:14px;line-height:1.8;">
            Talk soon,<br/>
            <strong style="color:${CYAN};font-size:16px;letter-spacing:1px;">NEEL_BHAVSAR</strong><br/>
            <span style="color:#4b5563;font-size:12px;letter-spacing:1px;">Node.js Developer // Backend Architect</span>
          </p>

        </td>
      </tr>

      <!-- ── Log line ── -->
      <tr>
        <td style="padding:12px 32px;background:#080e0e;border-top:1px solid ${BORDER};">
          <p style="margin:0;color:${GREEN};font-size:10px;">[200] auto-reply dispatched — queue_time: 0ms — status: DELIVERED</p>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="padding:14px 32px;border-top:1px solid ${BORDER};">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#2d3748;font-size:10px;letter-spacing:1px;">
                © 2025 Neel Bhavsar
              </td>
              <td align="right" style="color:#2d3748;font-size:10px;letter-spacing:1px;">
                portfolio.neelbhavsar.dev
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>
  `.trim();
}

/* ─── Route handler ─────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    /* ─── Validate environment ─── */
    const envCheck = validateEnvironment();
    if (!envCheck.valid) {
      console.error("Environment validation failed:", envCheck.error);
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    /* ─── Check rate limit ─── */
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitCheck = checkRateLimit(clientIp);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.message || "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    /* ─── Parse and validate input ─── */
    const { name, email, message } = await req.json();

    // Check required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Validate message length (minimum 10 chars, maximum 5000 chars)
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must not exceed 5000 characters." },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name must not exceed 100 characters." },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent XSS in emails
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = email.toLowerCase().trim(); // Email should be case-insensitive
    const sanitizedMessage = sanitizeHtml(message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "short", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short",
    });

    // Truncate message preview for auto-reply echo (max 180 chars)
    const preview = sanitizedMessage.length > 180
      ? sanitizedMessage.slice(0, 177) + "..."
      : sanitizedMessage;

    // 1. Notification email → Neel
    await transporter.sendMail({
      from: `"Portfolio Mailer" <${process.env.GMAIL_USER}>`,
      to: "neelbhavsar124@gmail.com",
      replyTo: sanitizedEmail,
      subject: `[NEW_MSG] ${sanitizedName} via portfolio — ${timestamp}`,
      html: buildOwnerEmail(sanitizedName, sanitizedEmail, sanitizedMessage, timestamp),
    });

    // 2. Auto-reply → sender
    await transporter.sendMail({
      from: `"Neel Bhavsar" <${process.env.GMAIL_USER}>`,
      to: sanitizedEmail,
      subject: `[ACK] Message received — Neel Bhavsar will respond shortly`,
      html: buildAutoReplyEmail(sanitizedName, preview),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
