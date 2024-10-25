import { Expense } from "../model/expense.model.js";

export const disp_by_id = async (req, res) => {
  try {
    
    const { id } = req.params;
    const userId = req.user.id;  // Get user ID from authenticated user

    // Find the expense by ID and userId
    const response_data = await Expense.findOne({ _id: id, userId: userId });

    if (!response_data) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Expense retrieved successfully',
      expense: response_data,
    });
  } catch (error) {
    console.error('Error in GET /disp_exp_by_id:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
