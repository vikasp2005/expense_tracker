import { Expense } from "../model/expense.model.js";
import { body, validationResult } from "express-validator";

export const edit_Exp = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .optional()
    .isIn(['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel', 'Salary'])
    .withMessage('Invalid category'),
  body('desc')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      if (inputDate > today) {
        throw new Error('Expense date cannot be in the future');
      }

      return true;
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const userId = req.user.id;  // Get user ID from authenticated user
      const updatedData = req.body;

      updatedData.last_modified_at = new Date();

      // Find the expense by ID and userId and update it
      const updatedExpense = await Expense.findOneAndUpdate({ _id: id, userId }, updatedData, { new: true });

      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found or unauthorized' });
      }

      res.status(200).json({
        message: 'Expense updated successfully',
        data: updatedExpense,
      });
    } catch (error) {
      console.error('Error in PUT /expense/:id:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];
