const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const router = express.Router();


//sign-up
const signUpSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firtname: z.string(),
  lastname: z.string(),
});
router.post("/sign-up", async (req, res) => {
  const body = req.body;
  const { success } = signUpSchema.safeParse(body);
  if (!success) {
    return res
      .status(400)
      .json({ message: "EMail already taken / Invalid request body" });
  }

  const existinguser = User.findOne({
    username: body.username,
  });

  if (existinguser._id) {
    return res
      .status(400)
      .json({ message: "EMail already taken / Invalid request body" });
  }

  const dbUser = await User.create(body);
  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );

  res.status(200).json({
    message: "User created successfully",
    token: token,
  });
});

//sign-in
const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});
router.post("/sign-in", async (req, res) => {
  const body = req.body;
  const { success } = signInSchema.safeParse(body);
  if (!success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const dbUser = await User.findOne({
    username: body.username,
    password: body.password,
  });

  if (!dbUser._id) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );

  res.status(200).json({
    message: "User Loged In Successfully",
    token: token,
  });
});

router.get("/", (req, res) => {});

module.exports = router;
