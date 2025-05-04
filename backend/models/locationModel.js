// models/locationModel.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        createdBy: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        editedBy: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
