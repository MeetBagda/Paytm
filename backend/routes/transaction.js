const express = require("express");
const { authMiddleware } = require("../middleware");
const { Transaction } = require("../db");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const transactions = await Transaction.find({
      $or: [
        { userId: userId, type: "credit" }, // User's credit transactions
        { sourceUserId: userId, type: "debit" }, // User's debit transactions (money sent)
        { userId: userId, type: "deposit" }, // User's credit transactions
        { userId: userId, type: "withdrawal" }, // User's credit transactions
      ],
    });

    res.json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
});

module.exports = router;