const nodemailer = require('nodemailer');

exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",  // Use "gmail" or any other SMTP service
            auth: {
                user: process.env.SENDER_EMAIL, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email app password
            },
        });

        const mailOptions = {
            from: `"Caliber Fitness" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};
