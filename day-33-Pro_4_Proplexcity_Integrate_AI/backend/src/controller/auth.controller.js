import UserModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BlacklistTokenModel } from "../models/blacklist_token.model.js";
import { sendEmail } from "../services/mail.service.js";

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    error.stack = "Please provide username, email and password";
    return next(error);
  }

  try {
    const isUserExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      const error = new Error("User already exists");
      error.status = 409;
      error.stack = "Please try with different username or email";
      return next(error);
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: hash,
    });

    const { password: _, ...safeUser } = newUser._doc;

    const emailVerificationToken = jwt.sign({
      email: newUser.email,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    await sendEmail({
      to: newUser.email,
      subject: "Welcome to Proplexcity!",
      html: `
          <p>Hi ${username},</p>
          <p>Thank you for registering on <strong>Proplexcity</strong>. We're excited to have you on board!</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Best regards,<br/>The Proplexcity Team</p>
      `,
      
    });
    

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });

  } catch (err) {
    const error = new Error("Internal Server Error");
    error.status = 500;
    error.stack = err.message;
    return next(error);
  }
};

export async function verifyEmail(req, res, next) {
    const {token} = req.query;
    
    if (!token) {
      const error =  new Error("Verification token is missing");
      error.status = 400;
      error.stack = "Please provide a valid token";
      return next(error);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findOne({email: decoded.email});
      if(!user){
        const error = new Error("User not found");
        error.status = 404;
        error.stack = "User with the given email does not exist";
        return next(error);
      }

      user.verified = true;
      await user.save();

      res.send(`
        <h1>Email Verified Successfully!</h1>
        <p>Thank you for verifying your email address. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
      `);

    } catch (error) {
      const err = new Error("Invalid or expired verification token");
      err.status = 400;
      err.stack = error.message;
      return next(err);
    }
} 


export const loginUser = async (req, res, next) => {
  const { email, password, username } = req.body;

  if ((!email && !username) || !password) {
    const error = new Error("All fields are required");
    error.status = 400;
    error.stack = "Please provide email and password";
    return next(error);
  }

  try {
    const user = await UserModel.findOne({
        $or: [
            {email}, 
            {username}
        ],
    }).select("+password");

    if(!user){
        const error = new Error("Invalid credentials");
        error.status = 401;
        error.stack = "User not exist";
        return next(error);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        const error = new Error("Invalid credentials");
        error.status = 401;
        error.stack = "Password not Matched!";
        return next(error);
    }


    if(!user.verified){
        const error = new Error("Email not verified");
        error.status = 401;
        error.stack = "Please verify your email before logging in";
        return next(error);
    }

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.cookie("token", token);

    const {password: _, ...safeUser} = user._doc;

    return res.status(200).json({
        message: "User logged in successfully!",
        user: safeUser,
    })
    
  } catch (error) {
    const err = new Error("Internal Server Error");
    err.status = 500;
    err.stack = error.message;
    return next(err);
  }
};

export const logoutUser = async (req, res, next) => {
    const token = req.cookies?.token;

    try {
        const blacklistToken = await BlacklistTokenModel.create({token});
        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully!",
        })

    } catch (error) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        err.stack = error.message;
        return next(err);
    }
}

export const getMe = async (req, res, next) => {
    const userId = req.user.id;;

    try {
        const user = await UserModel.findById(userId);

        if(!user){
            const error = new Error("User not found");
            error.status = 404;
            error.stack = "User with the given ID does not exist";
            return next(error);
        }

        return res.status(200).json({
            message: "User found successfully!",
            user: user,
        });

    } catch (error) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        err.stack = error.message;
        return next(err);
    }
}