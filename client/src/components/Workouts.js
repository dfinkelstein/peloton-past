import React, { Component } from "react";
import { format } from 'date-fns'
import WorkoutDataService from '../services/workouts.service'
import RideDataService from "../services/ride.service";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Chart from 'react-apexcharts'
import { Scrollbars } from 'react-custom-scrollbars-2';

class WorkoutItem extends Component {

    render() {
        let dateString = format(new Date(this.props.workout.start_time), "EEEE LLLL do, yyyy - h:mb")
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

class DetailCallout extends Component {

    render() {
        return (
            <div className="detail-callout">
                <p className="detail-callout--title">{this.props.title}</p>
                <p className="detail-callout--value">{this.props.value + this.props.unit}</p>
            </div>
        )
    }
}

class WorkoutSubDetails extends Component {

    secondsToMMSS(value) {
        return Math.floor((value % 3600) / 60) + ":" + String(Math.round(value % 60)).padStart(2, "0");
    }

    render() {
        if (!this.props.workout.metrics) return (<></>)
        return (
            <div className="workout-details--detail-area--workout">
                <div className="workout-details--detail-area--workout--stats">
                    <DetailCallout title="Duration" value={this.secondsToMMSS(this.props.workout.ride_length)} unit=" mins" />
                    <DetailCallout title="Total Output" value={Number(this.props.workout.total_output / 1000).toFixed(2)} unit=" kj" />
                    <DetailCallout title="Distance" value={this.props.workout.metrics.distance} unit=" mi" />
                    <DetailCallout title="Total Calories" value={this.props.workout.metrics.total_calories} unit=" kcal" />
                    <DetailCallout title="Active Calories" value={this.props.workout.metrics.active_calories} unit=" kcal" />
                    <DetailCallout title="Avg Output" value={this.props.workout.metrics.avg_output} unit=" W" />
                    <DetailCallout title="Avg Cadence" value={this.props.workout.metrics.avg_cadence} unit=" rpm" />
                    <DetailCallout title="Avg Resistance" value={this.props.workout.metrics.avg_resistance} unit="%" />
                    <DetailCallout title="Avg Speed" value={this.props.workout.metrics.avg_speed} unit=" mph" />
                </div>
                <div className="workout-details--chart" >
                    <Chart options={{
                            chart: {
                                id: 'workout-graph',
                                background: '#191C20'
                            },
                            xaxis: {
                                categories: this.props.workout.metrics?.aggregate_metrics.map(m => m.second),
                                tickAmount: this.props.workout.metrics?.aggregate_metrics.length / 10,
                                labels: {
                                    formatter: this.secondsToMMSS
                                }
                            },
                            stroke: {
                                width: 2,
                                curve: 'smooth',
                            },
                            theme: {
                                mode: 'dark'
                            },
                            colors: ['#2E93fA', '#66DA26', '#F86624', '#7E36AF', '#DF1C2F'],
                            tooltip: {
                                y: [
                                    {
                                        formatter: function(y) {
                                            return y + " watts";
                                        }
                                    },
                                    {
                                        formatter: function(y) {
                                            return y + " rpm";
                                        }
                                    },
                                    {
                                        formatter: function(y) {
                                            return y + "%";
                                        }
                                    },
                                    {
                                        formatter: function(y) {
                                            return y + " mph";
                                        }
                                    },
                                    {
                                        formatter: function(y) {
                                            return y + " bpm";
                                        }
                                    }
                                ]
                            }
                        }} series={[
                        {
                        name: 'Output',
                        data: this.props.workout.metrics?.aggregate_metrics.map(m => m.output)
                        },
                        {
                        name: 'Cadence',
                        data: this.props.workout.metrics?.aggregate_metrics.map(m => m.cadence)
                        },
                        {
                        name: 'Resistance',
                        data: this.props.workout.metrics?.aggregate_metrics.map(m => m.resistance)
                        },
                        {
                        name: 'Speed',
                        data: this.props.workout.metrics?.aggregate_metrics.map(m => m.speed)
                        },
                        {
                        name: 'Heart Rate',
                        data: this.props.workout.metrics?.aggregate_metrics.map(m => m.heart_rate)
                        }
                    ]} type="line" height="100%" />
                </div>
            </div>
        )
    }
}

class RideDetails extends Component {

    state = {
        rideDetails: {},
        loading: true
    }

    getRideDetails() {
        if (this.props.rideId === null) return;
        this.setState({loading: true});

        RideDataService.get(this.props.rideId)
          .then((response) => {
            this.setState( { rideDetails: response.data, loading: false } );
          })
          .catch((e) => {
            console.log(e);
          });
    }

    componentDidMount() {
        this.getRideDetails();
    }
  
    componentDidUpdate(prevProps) {
        if (prevProps.rideId !== this.props.rideId) {
            this.getRideDetails();
        }
    }

    render() {
        return (
            <>
                {this.state.loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <h2>{this.state.rideDetails?.ride?.description}</h2>
                )}
            </>
        )
    }
} 

class WorkoutDetails extends Component {

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
                    <WorkoutSubDetails workout={this.props.workout}/>
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
                    children.push(<WorkoutItem workout={workout} 
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
                    <WorkoutDetails workout={this.state.selectedWorkout} />
                </div>
            </div>
        );
    }
}