const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, Transaction } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId,
    });

    res.json({
        balance: account.balance,
    });
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to, note } = req.body;

    try {
        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(
            session
        );

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account",
            });
        }

        // Perform the transfer
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        // Create transaction records for sender and receiver
        await Transaction.create(
            [
                {
                    userId: req.userId,
                    type: "debit",
                    amount: -amount,
                    description: note,
                    sourceUserId: req.userId,
                    destinationUserId: to,
                },
                {
                    userId: to,
                    type: "credit",
                    amount: amount,
                    description: note,
                    sourceUserId: req.userId,
                    destinationUserId: to,
                },
            ],
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful",
        });
    } catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Transfer failed" });
    } finally {
        session.endSession();
    }
});

router.post("/deposit", authMiddleware, async (req, res) => {
    const { amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const account = await Account.findOne({ userId: req.userId }).session(
            session
        );

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: amount } }).session(session);

        // Create transaction record
        await Transaction.create(
          [
            {
              userId: req.userId,
              type: "deposit",
              description: "Deposit",
              amount: amount,
            },
          ],
            { session }
        );

        await session.commitTransaction();

        res.json({
            message: "Deposit successful",
        });
    }
    catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        console.error("Error during deposit:", error);
        res.status(500).json({ message: "Deposit failed" });
    } finally {
        session.endSession();
    }
});



router.post("/withdraw", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    const account = await Account.findOne({ userId: req.userId }).session(session);

      if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);


    await Transaction.create([
        {
            userId: req.userId,
            type: "withdrawal",
            description: "Withdrawal",
            amount: -amount,
        }
      ],{ session })

      await session.commitTransaction();

      res.json({
          message: "Withdraw successful",
      });
  }catch(error){
        // If an error occurs, abort the transaction
      await session.abortTransaction();
      console.error("Error during withdrawal:", error);
      res.status(500).json({ message: "Withdraw failed" });
  }finally{
    session.endSession();
  }
})

module.exports = router;