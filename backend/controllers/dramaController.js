const Drama = require('../models/Drama');

const addDrama = async (req, res) => {
    try {
        const newDrama = new Drama({
            name: req.body.name,
            rating: req.body.rating,
            genre: req.body.genre,
            year: req.body.year,
            coverImg: req.file.path
        });
        const savedDrama = await newDrama.save();
        res.status(201).json(savedDrama);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getDramas = async (req, res) => {
    try {
        const dramas = await Drama.find().sort({ createdAt: -1 });
        res.json(dramas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteDrama = async (req, res) => {
    try {
        const drama = await Drama.findByIdAndDelete(req.params.id);
        if (!drama) return res.status(404).json({ message: 'Drama not found' });
        res.json({ message: 'Drama deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateDrama = async (req, res) => {
    try {
        const updateFields = {
            name: req.body.name,
            rating: req.body.rating,
            genre: req.body.genre,
            year: req.body.year
        };
        if (req.file) {
            updateFields.coverImg = req.file.path;
        }
        const drama = await Drama.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );
        if (!drama) return res.status(404).json({ message: 'Drama not found' });
        res.json(drama);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {addDrama, getDramas, deleteDrama, updateDrama};