import { Resend } from "resend";
const resend = new Resend("re_dA8ZLFH2_Mc7mJNLa5Rvk74hpSga5XU6t"); //new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = "onboarding@resend.dev"; //process.env.FROM_EMAIL
export const sendEmailBlast = async (emails, subject, content)=>{
  const processedEmails = emails.flatMap(email =>
    email.includes(",") ? email.split(",").map(e => e.trim()) : email.trim()
  );

  console.log(`Sending emails to ${processedEmails.length} recipients`);

  const sendPromises = processedEmails.map((email) =>
    resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: content,
    })
  );

  return Promise.allSettled(sendPromises);
};
