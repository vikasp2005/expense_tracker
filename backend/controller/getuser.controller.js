import { User } from "../model/user.model.js";

export const getuser = async(req,res) => {
    try{

    const userId = req.user ? req.user.id : null;
      if (!userId) {
        console.error('User ID is missing');
        return res.status(400).json({ message: 'User is not authenticated' });
      }

      const user = await User.findOne({ _id: userId }).select('name email');
      res.status(200).json({
        message: 'user found  successfully',
        user: user,
      });
    }
    catch(error){
        console.error('Error in GET /user', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }


};