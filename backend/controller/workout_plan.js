const WorkoutPlan = require('../model/workout_plan_model');
const Exercise = require('../model/exercise_model');



// Workout Plan Controller
exports.createWorkoutPlan = async (req, res) => {
    try {
        const { name, seven_days } = req.body;
        const workoutPlan = new WorkoutPlan({ name, seven_days });
        await workoutPlan.save();
        res.status(201).json({ message: 'Workout plan created successfully', workoutPlan });
    } catch (error) {
        res.status(500).json({ message: 'Error creating workout plan', error: error.message });
    }
};

    exports.getWorkoutPlans = async (req, res) => {
        try {
            const workoutPlans = await WorkoutPlan.find();

            // Manually populate the nested arrays in seven_days
            const populatedWorkoutPlans = await Promise.all(workoutPlans.map(async (workoutPlan) => {
                const populatedSevenDays = await Promise.all(workoutPlan.seven_days.map(async (day) => {
                    return await Promise.all(day.map(async (exerciseId) => {
                        return await Exercise.findById(exerciseId);
                    }));
                }));

                // Convert populatedSevenDays to the correct format
                workoutPlan.seven_days = populatedSevenDays;
                return workoutPlan;
            }));

            res.json(populatedWorkoutPlans);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching workout plans', error: error.message });
            console.log(error);
        }
    };

exports.updateWorkoutPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Workout plan updated successfully', updatedWorkoutPlan });
    } catch (error) {
        res.status(500).json({ message: 'Error updating workout plan', error: error.message });
    }
};

exports.deleteWorkoutPlan = async (req, res) => {
    try {
        const { id } = req.params;
        await WorkoutPlan.findByIdAndDelete(id);
        res.json({ message: 'Workout plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting workout plan', error: error.message });
    }
};
