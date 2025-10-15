import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

export const getUserData = async (req, res) => {
  try {
    const {userId} = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }      
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,    
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    }
};