import { Expense } from "../model/expense.model.js";

export const disp_by_id = async(req,res) => {

    try{
        const { id } = req.params;

        const response_data = await Expense.findById(id);

        if(!response_data)
        {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({
            message : 'Expense retrived sucessfully',
            expense : response_data
        });
    }
    catch (error) {
        console.error('Error in POST /disp_exp_by_id:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
}