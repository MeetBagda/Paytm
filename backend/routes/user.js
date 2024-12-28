// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
  username: zod.string().min(3).max(30),
	password: zod.string().min(6),
	firstName: zod.string().max(50),
	lastName: zod.string().max(50)
})

router.post("/signup", async (req, res) => {
  console.log("success reached")
    const { success } = signupBody.safeParse(req.body)
    console.log(success)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    console.log("existingUser reached")

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    console.log("before user create")
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    console.log("before user create")

    console.log("before userid create")

    const userId = user._id;
    console.log("after userid create")

    console.log("before account create")

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    console.log("after account create")

    console.log("before token create")

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    console.log("after token create")

    res.json({
        message: "User created successfully",
        token: token
    })
})


const signinBody = zod.object({
  username: zod.string().min(3).max(30),
  password: zod.string().min(6) 
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
  password: zod.string().min(6).optional(), 
  firstName: zod.string().max(50).optional(),
  lastName: zod.string().max(50).optional()
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;