const WorkoutService = require("../services/workouts.service")

// exports.findAll = (req, res) => {
//     WorkoutService.getAllWorkouts()
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                   err.message || "Some error occurred while retrieving workouts."
//               });
//         });
// };

exports.findAll = (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    WorkoutService.getPaginatedWorkouts(page, limit)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving workouts."
              });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    WorkoutService.getWorkout( id )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Error retrieving workout with id: " + id 
              });
        });
};

exports.refreshWorkouts = (req, res) => {
  WorkoutService.refreshAllWorkouts()
    .then(() => {
        res.status(200).send()
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Error refreshing workouts"
        });
    });
};