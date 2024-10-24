import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  type: {
    type: String,
    enum: ["Earning", "Expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel', 'Salary'],
  },
  desc: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  date: {
    type: String,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  last_modified_at: {
    type: Date,
    default: Date.now,
  }
});

export const Expense = mongoose.model('Expense', expenseSchema);
