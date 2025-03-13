import { check } from "express-validator";

export const loginValidation = [
    check("email", "Email is Required").isEmail(),
    check("password", "Password with six or more Characters Required").isLength(
        { min: 6 }
    ),
]

export const registerValidation = [
    check("username", "Username is required and must be up to 2 characters").isString().isLength({
        min: 2,
    }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be six or more characters").isLength({
        min: 6,
    }),
]