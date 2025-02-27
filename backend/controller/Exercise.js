const Exercise = require('../model/exercise_model');


// Exercise Controller
exports.createExercise = async (req, res) => {
    try {
        const { name, reps, sets, duration } = req.body;
        const exercise = new Exercise({ name, reps, sets, duration });
        await exercise.save();
        res.status(201).json({ message: 'Exercise created successfully', exercise });
    } catch (error) {
        res.status(500).json({ message: 'Error creating exercise', error: error.message });
    }
};

exports.getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercises', error: error.message });
    }
};

exports.updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedExercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Exercise updated successfully', updatedExercise });
    } catch (error) {
        res.status(500).json({ message: 'Error updating exercise', error: error.message });
    }
};

exports.deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        await Exercise.findByIdAndDelete(id);
        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exercise', error: error.message });
    }
};

