import React, { Component } from "react";


class ProfileWorkoutCallout extends Component {
    render() {
        return (
            <div className="profile-workout-callout">
                <p className="profile-workout-callout--title">{this.props.title}</p>
                <p className="profile-workout-callout--value">{this.props.value}</p>
            </div>
        );
    }
}

export default class Header extends Component {

    render() {
        const renderWorkoutTotals = () => {
            let children = [];
            if (this.props.userInfo.workout_counts) {
                this.props.userInfo.workout_counts.map(item => (
                    children.push(<ProfileWorkoutCallout title={item.name} value={item.count} />)
                ));
            }
            return children;
        };

        return (
            <div className="profile-content">
                <div className="user-header">
                    <div className="user-data">
                        <div className="user-info">
                            <img className="user-image" src={this.props.userInfo.profile_image} alt="profile"/>
                            <div className="user-name-info">
                                <p className="user-name-info--name">{this.props.userInfo.name}</p>
                                <p className="user-name-info--username">{this.props.userInfo.username}</p>
                            </div>
                        </div>
                        <p className="user-location">{this.props.userInfo.location}</p>
                    </div>
                    <div className="follower-counts">
                        <p>Followers: {this.props.userInfo.followers}</p>
                        <p>Following: {this.props.userInfo.following}</p>
                    </div>
                </div>
                <div className="profile-data">
                    <p className="profile--total-workouts">Total Workouts: <span>{this.props.userInfo.total_workouts}</span></p>
                    <div className="profile--workout-totals">
                        {renderWorkoutTotals()}
                    </div>
                </div>
            </div>
        );
    }
}