const db = require("../models")
const User = db.user;

const { peloton } = require('peloton-client-node');

exports.getAuthenticatedUser = async () => {
    let authedUser = await User.findOne( {authedUser: true} ).exec();
    return authedUser;
}

exports.getUser = async (userID) => { 
    let user = await User.findOne( {uid: userID} ).exec();
    if (!user) {
        throw Error("Could not find user with id: " + userID);
    }
    else {
        return user;
    }
}

exports.removeUser = async (userID) => {
    await User.deleteOne({ uid: userID }).exec();
}

exports.updateUserData = async () => {
  // Get your own personal information
  const myInfo = await peloton.me();

  // Check to see if the authenticated user changed
  // If it did we need to clear out the workouts
  // and remove the current authed user in the database
  const currentUser = await this.getAuthenticatedUser()
  if (currentUser.uid !== myInfo.id) {
      // Clear out data
      const workouts = require("./workouts.service");
      workouts.clearAllWorkouts();
      this.removeUser(currentUser.uid);
  }

  await User.findOneAndUpdate(
    { uid: myInfo.id },
    {
      uid: myInfo.id,
      authed_user: true,
      name: myInfo.name,
      username: myInfo.username,
      email: myInfo.email,
      location: myInfo.location,
      profile_image: myInfo.image_url,
      followers: myInfo.total_followers,
      following: myInfo.total_following,
      total_workouts: myInfo.total_workouts,
      workout_counts: myInfo.workout_counts,
    },
    { upsert: true }
  );
};