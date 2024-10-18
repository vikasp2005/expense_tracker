import mongoose from "mongoose";

//===================================================
// Mongoose Schema

const expenseSchema = new mongoose.Schema({
    type : {
      type : String,
      enum : ["Earning","Expense"],
      required : true,

    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Transport', 'Entertainment', 'Health', 'Other', 'Travel','Salary'], // Updated enum
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
    last_modified_at :
    {
      type : Date,
      default : Date.now,
    }
  });
  
  // Create a single model for all expenses
  export const Expense = mongoose.model('Expense', expenseSchema);