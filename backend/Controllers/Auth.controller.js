import UserModel from "../Models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Utils/jwt.js";
import jwt from "jsonwebtoken";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";
import TransactionModel from "../Models/transaction.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match",
      });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email && existingUser.username === username) {
        return res.status(409).json({
          success: false,
          message:
            "Both Email and Username already exist.Please return to login page",
        });
      } else if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email already exist.Please return to login page",
        });
      } else if (existingUser.username === username) {
        return res.status(409).json({
          success: false,
          message: "Username already exist.Please select another username",
        });
      }
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email,
      username,
      password: hashPassword,
    });

    await newUser.save();
    // generateToken(res, newUser);

    return res.status(200).json({
      success: true,
      message: "Signup successful",
      signupUser: {
        id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.Please signup first",
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      return res.status(404).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    generateToken(res, user);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      loginUser: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      expires: new Date(0),
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        isAuthenticated: false,
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        isAuthenticated: false,
        message: "User not found",
      });
    }

    console.log("checkauth controller user", user);

    return res.status(200).json({
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error);
    return res
      .status(500)
      .json({ isAuthenticated: false, message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const resetToken = user.generateResetToken();
  await user.save();

  console.log("Reset token sent in email:", resetToken);
  console.log("Hashed token saved to DB:", user.resetPasswordToken);

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You requested a password reset.\n\nClick the link below:\n${resetURL}\n\nIf you didn’t request this, ignore this email.`;

  try {
    await sendEmail(user.email, "Reset Your Password", message);
    console.log("Sent token:", resetToken);
    console.log("Saved hash:", user.resetPasswordToken);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res
      .status(500)
      .json({ message: "Email could not be sent", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expire token" });
    }

    console.log("Received token from URL:", req.params.token);
    console.log("Hashed token used to query:", resetToken);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfullly" });
  } catch (error) {
    console.log("Error in reset password controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const loggedInUser = req.user.id;

    if (!amount || !type || !category) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const newTransaction = new TransactionModel({
      userId: loggedInUser,
      amount,
      type,
      category,
      description,
      date,
    });
    await newTransaction.save();
    res
      .status(200)
      .json({ success: true, message: "Transaction added successfully" });
  } catch (error) {
    console.log("error in addTransaction controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // console.log("userId fetchtransction prince", userId);

    const totalTransactions = await TransactionModel.countDocuments({ userId });

    const fetchUserTransaction = await TransactionModel.find({ userId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName email");

    if (fetchUserTransaction.length === 0) {
      return res
        .status(404)
        .json({ message: "No transaction available", success: false });
    }

    // console.log("fetching transactions",fetchUserTransaction)

    res.status(200).json({
      success: true,
      fetchUserTransaction,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (error) {
    console.log("error in fetchTransaction controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleteUserTransaction = await TransactionModel.findById(
      req.params.id
    );
    if (!deleteUserTransaction) {
      return res
        .status(401)
        .json({ message: "Transaction does not exist", success: false });
    }

    await TransactionModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Transaction deleted successfully", success: true });
  } catch (error) {
    console.log("Error in delete transaction controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const updateUserTransaction = await TransactionModel.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!updateUserTransaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction does not found" });
    }

    updateUserTransaction.amount = amount;
    updateUserTransaction.type = type;
    updateUserTransaction.category = category;
    updateUserTransaction.description = description;
    updateUserTransaction.date = date;

    await updateUserTransaction.save();
    res
      .status(200)
      .json({ success: true, message: "Transaction updated successfully" });
  } catch (error) {
    console.log("Error in update controller", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const fetchAllTransaction = async (req, res) => {
  try {
    const userId = req.user._id;

    const fetchAllUserTransaction = await TransactionModel.find({ userId })
      .sort({ date: -1 }) // latest first
      .populate("userId", "fullName email");

    if (!fetchAllUserTransaction || fetchAllUserTransaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    // console.log("fetchAllUserTransaction",fetchAllUserTransaction)

  return  res.status(200).json({
      success: true,
      fetchAllUserTransaction,
    });

  } catch (error) {
    console.log("error in fetchAllTransaction controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
