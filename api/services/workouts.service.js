const db = require("../models")
const Workout = db.workout;

const { peloton } = require('peloton-client-node');

exports.getAllWorkouts = async () => {
    let workouts = await Workout.find().exec();
    return workouts;
}

exports.getPaginatedWorkouts = async (page, limit) => {
    let workouts = await Workout.find().limit(limit).skip(page * limit);
    return workouts;
}

exports.getWorkout = async (workoutID) => {
    let workout = await Workout.findOne( {workout_id: workoutID} ).exec();
    if (!workout) {
        throw Error( "Could not find workout with id: " + workoutID )
    }
    else {
        res.send(workout);
    }
}

exports.clearAllWorkouts = async () => {
    await Workout.deleteMany({}).exec();
}

exports.refreshAllWorkouts = async () => {
  const users = require("./users.service");
  const authedUser = await users.getAuthenticatedUser()
  // Get all workouts workout info
  const allWorkouts = await peloton.workouts({
    limit: authedUser.total_workouts,
    page: 0,
  });

  for (const workout of allWorkouts.data) {
    // Get base workout data
    var workoutData = {
      workout_id: workout.id,
      start_time: workout.start_time * 1000, // Convert to millisecnds
      end_time: workout.end_time * 1000, // Convert to millisecnds
      workout_type: workout.workout_type,
      total_output: workout.total_work,
      device: workout.device_type,
      status: workout.status,
      ride_id: workout.ride.id,
      ride_name: workout.ride.title,
      ride_image: workout.ride.image_url,
      ride_type: workout.ride.fitness_discipline,
      ride_length: workout.ride.length,
    };

    // Get instructor info
    if (workout.ride.instructor_id != null) {
      var instructor = await peloton.instructor({ instructorId: workout.ride.instructor_id });
      workoutData.instructor_name = instructor.name;
    } else {
      workoutData.instructor_name = "Self";
    }

    // Get workout metrics
    var wpg = await peloton.workoutPerformanceGraph({ workoutId: workout.id });
    var metrics = {
      total_output: wpg.summaries.find((summary) => summary.slug === "total_output").value,
      distance: wpg.summaries.find((summary) => summary.slug === "distance").value,
      active_calories: wpg.summaries.find((summary) => summary.slug === "active_calories").value,
      total_calories: wpg.summaries.find((summary) => summary.slug === "total_calories").value,
      avg_output: wpg.average_summaries.find((summary) => summary.slug === "avg_output").value,
      avg_cadence: wpg.average_summaries.find((summary) => summary.slug === "avg_cadence").value,
      avg_resistance: wpg.average_summaries.find((summary) => summary.slug === "avg_resistance").value,
      avg_speed: wpg.average_summaries.find((summary) => summary.slug === "avg_speed").value,
      aggregate_metrics: [],
    };

    for (let second = 0; second < wpg.seconds_since_pedaling_start.length; second++) {
      const wm = {
        second: wpg.seconds_since_pedaling_start[second],
        output: wpg.metrics.find((metric) => metric.slug === "output").values[second],
        cadence: wpg.metrics.find((metric) => metric.slug === "cadence").values[second],
        resistance: wpg.metrics.find((metric) => metric.slug === "resistance").values[second],
        speed: wpg.metrics.find((metric) => metric.slug === "speed").values[second],
        heart_rate: wpg.metrics.find((metric) => metric.slug === "heart_rate").values[second],
      };
      metrics.aggregate_metrics.push(wm);
    }

    workoutData.metrics = metrics;

    await Workout.findOneAndUpdate({ workout_id: workoutData.workout_id }, workoutData, { upsert: true });
  }
};