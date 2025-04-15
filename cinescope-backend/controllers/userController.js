import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// userController.js
export const updateUserProfile = async (req, res) => {
    try {
      const { firstName, lastName, country } = req.body;
      
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.country = country || user.country;
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        country: updatedUser.country
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const addToFavorites = async (req, res) => {
    try {
      const { movieId } = req.body;
      
      const user = await User.findById(req.user._id);
      
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
      }
      
      res.status(200).json({ message: 'Added to favorites successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
export const getUserWatchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('recentlyWatched');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.recentlyWatched);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};