import { Expense } from "../model/expense.model.js";

export const disp_Exp = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Optional filters passed through query parameters
    const { category, minAmount, maxAmount, type,  startDate, endDate } = req.body;

    // Determine the date range based on the provided period or custom dates
    let matchFilter = {};

    // Default behavior: if no filters are provided, match all expenses
    if (startDate && endDate) {
      // Custom date range provided
      matchFilter.date = {
        $gte: new Date(startDate).toISOString().split('T')[0],
        $lte: new Date(endDate).toISOString().split('T')[0],
      };
    } 

    // Add additional filters
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

    // Filter by type (Expense or Earning)
    if (type && (type === 'Expense' || type === 'Earning')) {
      matchFilter.type = type;
    }
    console.log(matchFilter);
    // Aggregation Pipeline
    const aggregation = [
      {
        $match: matchFilter,
      },
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
    console.log(result);

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
