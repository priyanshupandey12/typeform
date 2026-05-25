import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key");

export async function sendCreatorNotification(params: {
  toEmail: string;
  creatorName: string;
  formTitle: string;
}) {
  const { toEmail, creatorName, formTitle } = params;

  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[MOCK EMAIL SENT TO CREATOR]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: New Response Received!`);
    console.log(`Hi ${creatorName},\n\nYou just received a new response on your form: "${formTitle}".\n\nCheck your dashboard to view the details.\n`);
    return;
  }

  try {
    await resend.emails.send({
      from: "SagaForms <noreply@sagaforms.com>", // Make sure to use an actual verified domain here for production!
      to: [toEmail],
      subject: `New Response: ${formTitle}`,
      html: `
        <div>
          <p>Hi ${creatorName},</p>
          <p>You just received a new response on your form: <strong>${formTitle}</strong>.</p>
          <p>Log in to your dashboard to view the details.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send creator notification:", error);
  }
}

export async function sendRespondentNotification(params: {
  toEmail: string;
  formTitle: string;
}) {
  const { toEmail, formTitle } = params;

  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[MOCK EMAIL SENT TO RESPONDENT]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: Your Submission Received`);
    console.log(`Thank you for your submission to "${formTitle}". We have successfully received your response.\n`);
    return;
  }

  try {
    await resend.emails.send({
      from: "SagaForms <noreply@sagaforms.com>", // Make sure to use an actual verified domain here for production!
      to: [toEmail],
      subject: `Submission Confirmation: ${formTitle}`,
      html: `
        <div>
          <p>Thank you!</p>
          <p>We have successfully received your submission to the form: <strong>${formTitle}</strong>.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send respondent notification:", error);
  }
}
