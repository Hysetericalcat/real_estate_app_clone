const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties (with optional category filter)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const properties = await Property.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: properties, count: properties.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single property
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
        res.json({ success: true, data: property });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST create property
router.post('/', async (req, res) => {
    try {
        const property = new Property(req.body);
        await property.save();
        res.status(201).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT update property
router.put('/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
        res.json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE property
router.delete('/:id', async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
        res.json({ success: true, message: 'Property deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
