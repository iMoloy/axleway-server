import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/token", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

  const isProduction = process.env.NODE_ENV === "production";

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .send({ success: true });
});

router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .send({ success: true });
});

export default router;
