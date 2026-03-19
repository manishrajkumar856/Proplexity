import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        const err = new Error(error.array().map((err) => err.msg).join(", "));
        err.status = 400;
        err.stack = error.array();
        return next(err);
    }

    next();
}

export const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").custom((value) => {
        if (value.length < 6) {
            throw new Error("password should be at least 6 characters long")
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/
        if (!passwordRegex.test(value)) {
            throw new Error("password should contain at least one uppercase letter and one number")
        }
        return true
    }).withMessage("password should be at least 6 characters long and contain at least one uppercase letter and one number"),,
  validate

];

export const loginValidation = [
  body("email")
    .if(
      body("username")
        .notEmpty()
        .withMessage("Username is required if email is not provided"),
    )
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").custom((value) => {
        if (value.length < 6) {
            throw new Error("password should be at least 6 characters long")
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/
        if (!passwordRegex.test(value)) {
            throw new Error("password should contain at least one uppercase letter and one number")
        }
        return true
    }).withMessage("password should be at least 6 characters long and contain at least one uppercase letter and one number"),
    validate,
];
