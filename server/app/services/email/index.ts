import { createTransport } from "nodemailer";

const { SMTP_SERVER, EMAIL_ADDRESS, EMAIL_PASSWORD, ADMIN_NAME, BASE_URL } =
  process.env;

const transporter = createTransport({
  host: SMTP_SERVER,
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

async function sendEmail(receiver: string, subject: string, content: string) {
  const info = await transporter.sendMail({
    from: `"${ADMIN_NAME}" <${EMAIL_ADDRESS}>`, // sender address
    to: receiver, // list of receivers
    subject, // Subject line
    // html: "<b>Hello world?</b>", // html body
    html: content,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}

export async function sendVerificationMail(receiver: string, token: string) {
  const template = `Please click this link to verify your email for tracking banners ${BASE_URL}/auth/verify/${token}`;
  await sendEmail(receiver, "Verify You Email", template);
}

export async function sendOTP(receiver: string, otp: string) {
  const tepmlate = `<h2>Please use this OTP to confirm login to the app:</h2>
  <br />
  <br />
  <h1 style="text-align: center;">${otp}</h2>
  `;
  await sendEmail(receiver, `Login OTP`, tepmlate);
}
