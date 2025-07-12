const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'FinSmart <noreply@finsmart.com>';

// Create transporter
const createTransporter = async () => {
  try {
    // For development, use test account
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating test account...');
      const testAccount = await nodemailer.createTestAccount();
      console.log('Test account created:', testAccount.user);
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    
    // For production, use real email service
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw error;
  }
};

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  try {
    console.log(`Sending OTP email to ${email}...`);
    
    // Create transporter
    const transporter = await createTransporter();
    
    // Email template
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0284c7;">FinSmart</h1>
          <p style="font-size: 18px; color: #333;">Your Verification Code</p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; text-align: center;">
          <p style="margin-bottom: 10px; color: #4b5563;">Please use the following code to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">${otp}</div>
          <p style="color: #4b5563; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </div>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'FinSmart - Your Verification Code',
      html,
    });
    
    // For development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
    }
    
    console.log('Message sent: %s', info.messageId);
    
    // Log the OTP for testing purposes (remove in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('OTP CODE FOR TESTING:', otp);
    }
    
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
