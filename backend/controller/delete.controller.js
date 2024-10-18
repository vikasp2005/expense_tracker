import { Expense } from "../model/expense.model.js";

export const delete_Exp = async(req,res) => {
    try{
        const { id } = req.params;

        const deletedExpense = await Expense.findByIdAndDelete(id);

        if(!deletedExpense)
        {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({
            message : 'Expense deleted sucessfully',
            data : deletedExpense
        });


    }
    catch (error) {
        console.error('Error in DELETE /delete_exp:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
}