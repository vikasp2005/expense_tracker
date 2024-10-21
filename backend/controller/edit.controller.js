import { Expense } from "../model/expense.model.js";
import { body, validationResult } from "express-validator";

export const edit_Exp = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .optional()
    .isIn(['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel','Salary'])
    .withMessage('Invalid category'),
  body('desc')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('invalid date formate')
    .custom((value) => {
      // Convert the value to a Date object
      const inputDate = new Date(value);

      // Get today's date without the time component
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);  // Ensure time is set to 00:00:00 for comparison

      // Check if the input date is greater than today
      if (inputDate > today) {
        throw new Error('Expense date cannot be in the future');
      }

      return true;
    }),
  

  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updatedData = req.body;

      updatedData.last_modified_at = new Date();
      // Find the expense by ID and update it
      const updatedExpense = await Expense.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
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
