import React, { Component } from "react";
import { format } from 'date-fns'
import WorkoutDataService from '../services/workouts.service'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { RideDetails } from "./RideDetails";
import { WorkoutDetails } from "./WorkoutDetails";

class WorkoutListItem extends Component {

    render() {
        let dateString = format(new Date(this.props.workout.start_time), "EEEE LLLL do, yyyy - h:mmb")
        return (
            <div className="workout-list--item" onClick={this.props.onClick}>
                <span className={"material-icons workout-list--item--icon" + (this.props.selected ? " selected" : "")}>pedal_bike</span>
                <div className="workout-list--item--details">
                    <h5>{this.props.workout.ride_name}</h5>
                    <p style={{"text-transform": "capitalize"}}>{this.props.workout.ride_type} - {this.props.workout.instructor_name}</p>
                    <p>{dateString}</p>
                </div>
            </div>
        );
    }
}
class WorkoutMain extends Component {

    render() {
        let dayString = this.props.workout.start_time ? format(new Date(this.props.workout.start_time), "LLLL do, yyyy") : "Loading..."
        let timeString = this.props.workout.start_time ? format(new Date(this.props.workout.start_time), "h:mb") : "Loading..."
        return (
            <>
            <div className="workout-details--header">
                <div className="workout-details--header--title">
                    <img src={this.props.workout.ride_image} className="rounded-circle workout-details--header--title--icon" alt="" />
                    <h1 className="workout-details--header--title--name">{this.props.workout.ride_name}</h1>
                    <div className="workout-details--header--title--date">
                        <p>{dayString}</p>
                        <p>{timeString}</p>
                    </div>
                </div>
                <div className="workout-details--header--details">
                    <p style={{"text-transform": "capitalize"}}>{this.props.workout.ride_type}</p>
                    <p>{this.props.workout.instructor_name}</p>
                </div>
            </div>
            <hr className="workout-details--divider"/>
            <Tabs className="workout-details--detail-area" selectedTabClassName="active">
                <TabList>
                    <Tab>Workout Details</Tab>
                    <Tab>Ride Details</Tab>
                </TabList>

                <TabPanel>
                    <WorkoutDetails workout={this.props.workout}/>
                </TabPanel>
                <TabPanel>
                    <RideDetails rideId={this.props.workout?.ride_id}/>
                </TabPanel>
            </Tabs>
            </>
        )
    }
}

export default class Workouts extends Component {

    state = {
        workouts: [],
        selectedWorkout: {},
    }

    getWorkouts() {
        WorkoutDataService.getAll()
          .then((response) => {
            this.setState( { workouts: response.data } );
            this.setState( { selectedWorkout: this.state.workouts[0] } );
          })
          .catch((e) => {
            console.log(e);
          });
    }
  
    componentDidMount() {
        this.getWorkouts();
    }

    setSelectedWorkout(workout) {
        this.setState( {selectedWorkout: workout} );
    }

    render() {
        const renderWorkoutListItems = () => {
            let children = [];
            if (this.state.workouts) {
                this.state.workouts.map(workout => (
                    children.push(<WorkoutListItem workout={workout} 
                                               onClick={() => this.setSelectedWorkout(workout)}
                                               selected={this.state.selectedWorkout.workout_id === workout.workout_id}/>)
                ));
            }
            return children;
        };

        return (
            <div className="workouts-content">
                <div className="workout-list">
                    <h2>Workouts</h2>
                    <Scrollbars>
                        {renderWorkoutListItems()}
                    </Scrollbars>
                </div>
                <div className="workout-details">
                    <WorkoutMain workout={this.state.selectedWorkout} />
                </div>
            </div>
        );
    }
}