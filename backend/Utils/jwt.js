import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};
