import { Router } from "express";
import { getMe, loginUser, logoutUser, registerUser, verifyEmail } from "../controller/auth.controller.js";
import { identifyUser } from "../middleware/auth.middleware.js";
import { loginValidation, registerValidation } from "../validators/auth.validator.js";

const authRouter = Router();


/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public   
 */
authRouter.post("/register", registerValidation, registerUser);


/**
 * @route Get /auth/verify-email
 * @desc Verify user's email using the token sent to their email
 * @access Public   
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public   
 */
authRouter.post("/login",loginValidation,  loginUser);

/**
 * @route POST /auth/logout
 * @desc Logout user by blacklisting the token
 * @access Private
 */
authRouter.get("/logout", identifyUser, logoutUser);  

/**
 * @route GET /auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
authRouter.get("/get-me", identifyUser, getMe);


export default authRouter;