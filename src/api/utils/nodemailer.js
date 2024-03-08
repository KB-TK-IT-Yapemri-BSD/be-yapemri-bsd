import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TRANSPORT_EMAIL,
      pass: process.env.TRANSPORT_PASSWORD,
    },
  });

  const data = req.body;

  const emailContent = "Someone sent a request for approval!";

  const mailOptions = {
    from: process.env.TRANSPORT_EMAIL,
    to: process.env.TRANSPORT_EMAIL,
    subject: "New data added in your app",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
}
