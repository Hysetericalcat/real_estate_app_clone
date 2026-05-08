const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['house', 'apartment', 'commercial', 'rent'],
        required: true,
    },
    price: { type: Number, required: true },
    priceLabel: { type: String }, // e.g. "₹85 Lakh", "₹18K/mo"
    location: { type: String, required: true },
    locality: { type: String, required: true },
    area: { type: Number, required: true }, // in sq ft
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    floors: { type: Number, default: 1 },
    parking: { type: Boolean, default: false },
    furnished: {
        type: String,
        enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
        default: 'Unfurnished',
    },
    amenities: [{ type: String }],
    highlights: [{ type: String }],
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Rented', 'Under Negotiation'],
        default: 'Available',
    },
    facing: { type: String, default: '' },
    age: { type: String, default: 'New' },
    contactPerson: { type: String, default: 'Estate Sphere Agent' },
    contactPhone: { type: String, default: '+91 98765 43210' },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
