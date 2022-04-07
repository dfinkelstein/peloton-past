const UserService = require("../services/users.service")

exports.getAuthenticatedUser = (req, res) => {
    UserService.getAuthenticatedUser()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving authenticated user."
              });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    UserService.getUser( id )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message || "Error retrieving user with id: " + id 
              });
        });
};

exports.updateUserInfo = (req, res) => {
    UserService.updateUserData()
        .then(() => {
            res.status(200).send()
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error refreshing user data"
            });
        });
};