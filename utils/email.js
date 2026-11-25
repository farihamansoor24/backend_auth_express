import nodemailer from "nodemailer";


const emailSender = async (body) => {
  try {
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});


// 2. Email Send Karein

   await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        ...body
    });
  }
  catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
 export default emailSender;