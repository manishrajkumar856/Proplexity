import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log("GOOGLE_USER: ", process.env.GOOGLE_CLIENT_ID);


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN_SECRET,
    },
});

// Verify the connection Configuration
transporter.verify((error, success)=> {
    if(error){
        console.log("Error in connecting to email server: ", error);
    }
    else{
        console.log("Email server is ready to take messages: ", success);
    }
})


export async function sendEmail({to, subject, html, text}) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.log("Error in sending email: ", error);
    }
}

// module.exports = transporter;