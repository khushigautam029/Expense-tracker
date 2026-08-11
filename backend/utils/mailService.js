import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

export const sendOTPEmail = async (toEmail, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: toEmail,
            subject: "Expense Tracker - Email Verification OTP",

            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Expense Tracker Verification</title>
            </head>

            <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
                <tr>
                <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

                <!-- Header -->
                <tr>
                <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:35px;text-align:center;color:white;">
                <h1 style="margin:0;font-size:30px;">💰 Expense Tracker </h1>
                <p style="margin-top:10px;font-size:16px;"> Email Verification </p>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding:40px;">
                <h2 style="margin-top:0;color:#1e293b;"> Hello, </h2>
                <p style="font-size:16px;color:#475569;line-height:1.7;">
                    Thank you for creating your
                    <strong>Expense Tracker</strong> account.
                </p>

                <p style="font-size:16px;color:#475569;line-height:1.7;">
                    To complete your registration, please verify your email address using the One-Time Password (OTP) below.
                </p>

                <div
                    style="margin:35px 0;text-align:center;background:#eff6ff;border:2px dashed #2563eb;padding:25px;border-radius:12px;">
                <p style="margin:0;font-size:14px;color:#64748b;letter-spacing:1px;">
                    YOUR VERIFICATION CODE
                </p>
                <h1 style="margin:12px 0 0;font-size:42px;letter-spacing:12px;color:#2563eb;"> ${otp} </h1>
                </div>

                <div
                    style="background:#fff7ed;border-left:5px solid #f59e0b;padding:18px;border-radius:8px;">
                <p style="margin:0;color:#92400e;">
                        ⏰ This OTP is valid for
                        <strong>10 minutes</strong>.
                </p>
                </div>

                <p style="margin-top:30px;font-size:15px;color:#475569;line-height:1.8;">
                    If you didn't request this verification, you can safely ignore this email.
                    No one can access your account without this OTP.
                </p>

                <p style="font-size:15px;color:#475569;line-height:1.8;">
                    For your security,
                <strong>never share your OTP with anyone.</strong>
                </p>
                </td>
                </tr>

            <!-- Footer -->
            <tr>
            <td style="background:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:14px;color:#64748b;">
                Thank you for choosing
                <strong>Expense Tracker</strong>
            </p>
            <p style="margin-top:10px;font-size:13px;color:#94a3b8;">
                Track Smarter • Save Better • Grow Faster
            </p>
            <p style="margin-top:25px;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} Expense Tracker.
                All Rights Reserved.
            </p>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </body>
            </html>`
        });

        console.log("OTP Email Sent Successfully");
    } catch (error) {
        console.log("Email Error:", error.message);
        throw error;
    }
};