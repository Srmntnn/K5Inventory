const Location = require('../models/locationModel');

const createLocation = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("USER ID:", req.userId);

        const { name, description } = req.body;
        const createdBy = req.userId;

        if (!name || !description) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existing = await Location.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, message: "Location already exists." });
        }

        const newLocation = new Location({
            name,
            description,
            createdBy: req.userId, // from auth middleware
        });

        const savedLocation = await newLocation.save();
        res.status(201).json({ success: true, message: "Location created successfully.", location: savedLocation });
    } catch (error) {
        console.error("Error creating location:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Company already exists." });
        }

        return res.status(500).json({ success: false, message: "Server error." });
    }
}

const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find()
            .populate('createdBy', 'username')
            .populate('editedBy', 'username');

        // Ensure that locations is an array
        res.status(200).json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ message: "Server error." });
    }
}

module.exports = {
    createLocation,
    getAllLocations
    // Add other location-related functions here (update, delete, etc.)
};