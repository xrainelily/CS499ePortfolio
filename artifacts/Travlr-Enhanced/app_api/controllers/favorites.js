const User = require('../models/user');
const Trip = require('../models/travlr');

// GET /favorites
// Return the complete trip records saved by the authenticated user.
const favoritesList = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const trips = await Trip.find({
            code: { $in: user.favorites }
        }).exec();

        return res.status(200).json(trips);
    } catch (error) {
        console.error('Unable to retrieve favorites:', error.message);
        return res.status(500).json({
            message: 'Unable to retrieve favorite trips.'
        });
    }
};

// POST /favorites/:tripCode
// Add a trip code only if it is not already in the user's favorites array.
const favoritesAdd = async (req, res) => {
    try {
        const trip = await Trip.findOne({ code: req.params.tripCode }).exec();

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }

        const user = await User.findByIdAndUpdate(
            req.auth._id,
            { $addToSet: { favorites: trip.code } },
            { new: true }
        ).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        console.error('Unable to save favorite:', error.message);
        return res.status(500).json({
            message: 'Unable to save favorite trip.'
        });
    }
};

// DELETE /favorites/:tripCode
// Remove the selected trip code from the authenticated user's favorites.
const favoritesRemove = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.auth._id,
            { $pull: { favorites: req.params.tripCode } },
            { new: true }
        ).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        console.error('Unable to remove favorite:', error.message);
        return res.status(500).json({
            message: 'Unable to remove favorite trip.'
        });
    }
};

module.exports = {
    favoritesList,
    favoritesAdd,
    favoritesRemove
};
