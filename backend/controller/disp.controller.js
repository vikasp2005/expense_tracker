import { Expense } from "../model/expense.model.js";
import mongoose from "mongoose";

export const disp_Exp = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);  // Get the user ID from the authenticated user
    const { category, minAmount, maxAmount, type, startDate, endDate } = req.body;
    // Determine the date range based on the provided period or custom dates
    let matchFilter = { userId };  // Only fetch expenses for this user

    if (startDate && endDate) {
      matchFilter.date = {
        $gte: new Date(startDate).toISOString().split('T')[0],
        $lte: new Date(endDate).toISOString().split('T')[0],
      };
    }

    if (category) {
      matchFilter.category = category;
    }

    if (minAmount || maxAmount) {
      matchFilter.amount = {};
      if (minAmount) {
        matchFilter.amount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        matchFilter.amount.$lte = parseFloat(maxAmount);
      }
    }

    if (type && (type === 'Expense' || type === 'Earning')) {
      matchFilter.type = type;
    }

    const aggregation = [
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          expenses: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          expenses: 1,
        },
      },
    ];

    const result = await Expense.aggregate(aggregation);
    if (result.length === 0) {
      return res.status(200).json({
        message: 'No expenses found for the selected filters.',
        totalAmount: 0,
        expenses: [],
      });
    }

    const { totalAmount, expenses } = result[0];

    res.status(200).json({
      message: 'Expenses retrieved successfully.',
      totalAmount,
      expenses,
    });
  } catch (error) {
    console.error('Error in GET /disp_exp:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
