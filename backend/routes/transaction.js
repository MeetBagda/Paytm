const express = require("express");
const { authMiddleware } = require("../middleware");
const { Transaction } = require("../db");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { startDate, endDate, type, page = 1, limit = 10, sort = 'desc'} = req.query;

  const query = {
    $or:[
       {
        userId: userId
      },
      {
        sourceUserId: userId
      },
      {
         destinationUserId: userId
      }
    ]
  };

  if (startDate && endDate) {
    query.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (type) {
    query.type = type;
  }


  const skip = (page - 1) * limit;

  try{

    const transactions = await Transaction.find(query)
    .sort({ timestamp: sort === 'desc' ? -1 : 1})
    .skip(skip)
    .limit(parseInt(limit))
    const totalTransactions = await Transaction.countDocuments(query)


     res.json({
        transactions,
        totalTransactions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / limit)
     });

  }catch(error){
    res.status(500).json({
        message: "Failed to retrieve transactions",
        error: error.message
    })
  }

});

module.exports = router;