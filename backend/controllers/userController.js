const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/sendEmail');
const transporter = require('../database/nodemailer');
const { text } = require('express');

// const signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'Email already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ name, email, password: hashed, role });

//     await sendWelcomeEmail(email, name);

//     res.status(201).json({ message: 'User created' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing Details' })
  }

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role })
    await user.save()

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 160 * 60 * 1000
    })

    const { password: _, ...userData } = user._doc;

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to K5 News Inventory!',
      text: `Your account has been created with email: ${email}`
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      user: userData,
    })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and Password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // fixed duration
    });

    // Return user info (remove sensitive fields)
    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      user: userData,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const login = async (req, res) => {

//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.json({ success: false, messagë: 'Email and Password are required' })
//   }

//   try {
//     const user = await User.findOne({ email })

//     if (!user) {
//       return res.json({ success: false, messagë: 'Invalid email' })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.json({ success: false, messagë: 'Invalid password' })
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//       maxAge: 7 * 24 * 160 * 60 * 1000
//     })

//     return res.json({ success: true })
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.json({ success: true, message: 'Logged out' })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: 'Incorrect password' });



//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const sendVerifyOTP = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: 'Account already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.verifyOTP = otp
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    }
    await transporter.sendMail(mailOption);

    res.json({ success: true, message: 'Verification OTP sent on Email' })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.json({ success: false, message: 'Missing details' })
  }

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    if (user.verifyOTP === '' || user.verifyOTP !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' })
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' })
    }

    user.isVerified = true
    user.verifyOTP = '';
    user.verifyOtpExpiresAt

    await user.save();
    return res.json({ success: true, message: 'Email Verified Successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: 'Authenticated' })
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

const sendRestPasswordOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.resetOtp = otp
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000

    await user.save()

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. Use this OTP to reset your password`,
    }

    await transporter.sendMail(mailOption)

    return res.json({ success: true, message: 'Reset Password OTP sent on Email' })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Missing details' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' })
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetOtp = ''
    user.resetOtpExpiresAt = 0

    await user.save()

    return res.json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
module.exports = { signup, login, logout, sendVerifyOTP, verifyEmail, isAuthenticated, sendRestPasswordOTP, resetPassword };
// module.exports = { signup, login, logout, sendVerifyOTP, verifyEmail, isAuthenticated };
