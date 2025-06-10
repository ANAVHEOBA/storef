import nodemailer from 'nodemailer';

// Create production transporter
const createProductionTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email credentials not configured');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Get appropriate transporter based on environment
const getTransporter = async () => {
    if (process.env.NODE_ENV === 'development') {
        // In development, use Gmail but log the preview URL
        const transporter = createProductionTransporter();
        return transporter;
    }
    return createProductionTransporter();
};

export const sendVerificationEmail = async (email: string, code: string) => {
    try {
        const transporter = await getTransporter();
        
        const mailOptions = {
            from: `"StoreF Verification" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Email Verification</h1>
                    <p>Thank you for registering with StoreF. To complete your registration, please use the verification code below:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h2 style="color: #007bff; margin: 0;">${code}</h2>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        if (process.env.NODE_ENV === 'development') {
            console.log('Email sent successfully to:', email);
            console.log('Message ID:', info.messageId);
        }
        
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw error, just return false to allow registration to continue
        return false;
    }
};