const OTP = require('../models/OTP');

// OTP expiration time in minutes
const OTP_EXPIRY_MINUTES = 10;

// Generate a random 6-digit OTP
exports.generateOTP = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP for a user
exports.storeOTP = async (email, otp) => {
  try {
    // Remove any existing OTP for this email
    await OTP.deleteMany({ email });
    
    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
    
    // Store the new OTP
    await OTP.create({ email, otp, expiresAt });
    
    console.log(`OTP stored for ${email}`);
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

// Verify OTP for a user
exports.verifyOTP = async (email, otp) => {
  try {
    const now = new Date();
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      expiresAt: { $gt: now }
    });
    
    if (otpRecord) {
      // Remove the OTP after successful verification
      await OTP.deleteOne({ _id: otpRecord._id });
      console.log(`OTP verified for ${email}`);
      return true;
    }
    
    console.log(`Invalid or expired OTP for ${email}`);
    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};
