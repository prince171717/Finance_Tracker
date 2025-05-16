import joi from "joi";
import jwt from "jsonwebtoken";
import UserModel from "../Models/user.js";

export const signUpValidation = (req, res, next) => {
  const schema = joi.object({
    fullName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    username: joi
      .string()
      .min(5)
      .max(50)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).*$"
        )
      )
      .messages({
        "string.pattern.base":
          "Username must include uppercase, lowercase, number, and special character.",
      })
      .required(),
    password: joi
      .string()
      .min(3)
      .max(50)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).*$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(404).json({ message: error.details[0].message });
  }
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = joi.object({
    emailOrUsername: joi
      .alternatives()
      .try(
        joi.string().email(),
        joi
          .string()
          .min(5)
          .max(50)
          .pattern(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).*$"
            )
          )
          .messages({
            "string.pattern.base":
              "Username must include uppercase, lowercase, number, and special character.",
          })
      )
      .messages({
        "alternatives.match":
          "Email must be valid OR Username must include uppercase, lowercase, number, and special character.",
      })
      .required(),

    password: joi
      .string()
      .min(3)
      .max(50)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).*$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(404).json({ message: error.details[0].message });
  }
  next();
};

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized. No token provided",
      });
    }

    console.log("protected route token", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("protected route decoded", decoded);

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. User not found",
      });
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "strict",
      });
      return res.status(401).json({
        message: "Password changed recently. Please log in again.",
      });
    }

    req.user = user;
    console.log("authmiddleware",req.user)

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};
