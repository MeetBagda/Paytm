const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");
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

  //   ---------------add some random money to user account----------------
  await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.random() * 10000,
  });

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

//update user
const updateBody = z.object({
  password: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ message: "Error while updating user information" });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({ message: "User information updated successfully" });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});
module.exports = router;
