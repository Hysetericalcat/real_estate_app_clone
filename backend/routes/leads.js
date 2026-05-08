const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET all leads
router.get('/', async (req, res) => {
    try {
        const { status, interest } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (interest) filter.interest = interest;
        const leads = await Lead.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: leads, count: leads.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET lead stats summary
router.get('/stats/summary', async (req, res) => {
    try {
        const total = await Lead.countDocuments();
        const byStatus = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const thisWeek = await Lead.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        res.json({ success: true, data: { total, byStatus, thisWeek } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single lead
router.get('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
        res.json({ success: true, data: lead });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST create lead
router.post('/', async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT update lead
router.put('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
        res.json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST add note to lead
router.post('/:id/notes', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
        lead.notes.push({ text: req.body.text });
        lead.lastContacted = new Date();
        await lead.save();
        res.json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
        res.json({ success: true, message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
