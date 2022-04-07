module.exports = mongoose => {
    const WorkoutMetric = new mongoose.Schema(
        {
            second: Number,
            output: Number,
            cadence: Number,
            resistance: Number,
            speed: Number,
            heart_rate: Number
        }, { _id: false }
    );
    const Workout = mongoose.model(
        "workout",
        mongoose.Schema(
            {
                workout_id: String,
                start_time: Date,
                end_time: Date,
                workout_type: String,
                total_output: Number,
                device: String,
                status: String,
                ride_id: String,
                ride_name: String,
                ride_image: String,
                ride_type: String,
                ride_length: Number,
                instructor_name: String,
                metrics: {
                    total_output: Number,
                    distance: Number,
                    active_calories: Number,
                    total_calories: Number,
                    avg_output: Number,
                    avg_cadence: Number,
                    avg_resistance: Number,
                    avg_speed: Number,
                    aggregate_metrics: [WorkoutMetric]
                }
            }
        )
    );
    return Workout;
}