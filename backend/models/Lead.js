const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    interest: {
        type: String,
        enum: ['house', 'apartment', 'commercial', 'rent', 'any'],
        default: 'any',
    },
    budget: { type: String, default: '' }, // e.g. "50L - 80L"
    budgetMin: { type: Number, default: 0 },
    budgetMax: { type: Number, default: 0 },
    preferredLocality: { type: String, default: '' },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Site Visit', 'Negotiating', 'Closed', 'Lost'],
        default: 'New',
    },
    source: {
        type: String,
        enum: ['Walk-in', 'Website', 'Referral', 'Social Media', 'Phone', 'Other'],
        default: 'Other',
    },
    assignedTo: { type: String, default: 'Unassigned' },
    notes: [NoteSchema],
    lastContacted: { type: Date, default: null },
    followUpDate: { type: Date, default: null },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
