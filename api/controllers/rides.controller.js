const { peloton } = require('peloton-client-node');

exports.getRideByID = (req, res) => {
    const id = req.params.id;
    peloton.rideDetails({ rideId: id })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving workouts."
            });
        });
}