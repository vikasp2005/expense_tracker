import { Expense } from "../model/expense.model.js";

export const delete_Exp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;  // Get user ID from authenticated user

    // Find the expense by ID and userId
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Expense deleted successfully',
      data: deletedExpense,
    });
  } catch (error) {
    console.error('Error in DELETE /delete_exp:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
