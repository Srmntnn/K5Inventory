const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    itemName: { required: true, type: String },
    description: String,
    serialNo: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    model: {
        type: String,
        required: true,
    },

    dateOfPurchase: {
        type: Date,
    },
    user: {
        type: String,
        required: true,
        enum: ["normal user", "department", "admin"],
        default: "normal user",
    },
    quantity: Number,
    status: { type: String, enum: ['damaged', 'good condition', 'need repair'], default: 'good condition' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    location: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },
    ],
}, { timestamps: true });

const Item = mongoose.model('item', itemSchema);
module.exports = Item;