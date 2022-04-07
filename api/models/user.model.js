module.exports = mongoose => {
    const User = mongoose.model(
        "user",
        mongoose.Schema(
            {
                uid: { type: String, unique: true },
                authed_user: Boolean,
                name: String,
                username: String,
                email: String,
                location: String,
                profile_image: String,
                followers: Number,
                following: Number,
                total_workouts: Number,
                // workout_counts: {
                //     bike_bootcamp: Number,
                //     cardio: Number,
                //     circuit: Number,
                //     cycling: Number,
                //     meditation: Number,
                //     running: Number,
                //     strength: Number,
                //     stretching: Number,
                //     walking: Number,
                //     yoga: Number,
                // }
                workout_counts: [mongoose.Schema.Types.Mixed]
            }
        )
    );
    return User;
}