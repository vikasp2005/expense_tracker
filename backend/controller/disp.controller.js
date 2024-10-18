import {Expense} from "../model/expense.model.js";
export const disp_Exp = async (req, res) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // Zero-based index (0 = January)
  
      // Define the start and end dates for the current month
      const startDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${(month + 2).toString().padStart(2, '0')}-01`;
  
      // Aggregation Pipeline
      const aggregation = [
        {
          $match: {
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
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
          message: 'No expenses found for the current month.',
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
    } 
    catch (error) {
      console.error('Error in GET /disp_exp:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  