const express = require('express');
const userRouter = require('./user');
const accountRouter = require('./account');
const transactionRouter = require('./transaction'); // <-- Add this

const router = express.Router();

router.use('/user', userRouter);
router.use('/account', accountRouter);
router.use('/transaction', transactionRouter); // <-- Add this too

module.exports = router;