import { Resend } from "resend";

import emailTemplate from "../../email/emailTemplate";
import apiResponse from "@/type/apiResponse";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "joy <onboarding@joy.albiabd.com>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: emailTemplate({ username, otp: verifyCode }),
    });
    console.log(username, verifyCode);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
