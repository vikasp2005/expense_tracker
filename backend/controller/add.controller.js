import { Expense } from "../model/expense.model.js";
import { body, validationResult } from "express-validator";

export const add_Exp = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than 0'),
  body('category')
    .isIn(['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel', 'Salary'])
    .withMessage('Invalid category'),
  body('type')
    .isIn(['Expense', 'Earning'])
    .withMessage('Type must be either "Expense" or "Earning"'),
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
      today.setUTCHours(0, 0, 0, 0);  // Remove time for comparison

      if (inputDate > today) {
        throw new Error('Date cannot be in the future');
      }

      return true;
    }),

  async (req, res) => {
    // Add validation check and logging
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { amount, category, type, desc, date } = req.body;

      // Ensure that userId is set and log it
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        console.error('User ID is missing');
        return res.status(400).json({ message: 'User is not authenticated' });
      }

      // Create a new expense or earning document
      const newExpense = new Expense({
        userId,  // Attach the userId to the expense
        amount,
        category,
        type,  
        desc,
        date: date ? date : new Date().toISOString().split('T')[0],
        added_on: new Date(),
        last_modified_at: new Date(),
      });

      // Save to the database and log the result
      const savedExpense = await newExpense.save();
     

      res.status(200).json({
        message: 'Expense/Earning added successfully',
        data: savedExpense,
      });
    } catch (error) {
      console.error('Error in POST /add_exp:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];
