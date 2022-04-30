import React, { Component } from "react";
import { format } from 'date-fns';
import RideDataService from "../services/ride.service";
import { Scrollbars } from 'react-custom-scrollbars-2';
import Chart from 'react-apexcharts';
import { DetailCallout } from "./DetailCallout";

export class PlaylistItem extends Component {

    render() {
        return (
            <div className="playlist-item">
                <img className="rounded-circle playlist-item--icon" src={this.props.song.album.image_url} alt={this.props.song.album.name} />
                <div className="playlist-item--details">
                    <p className="playlist-item--details--title">{this.props.song.title}</p>
                    <p className="playlist-item--details--artist">{this.props.song.artists.map(a => {return a.artist_name}).join(", ")}</p>
                </div>
            </div>
        );
    }
}

export class RideDetails extends Component {

    state = {
        rideDetails: {},
        loading: true
    };

    getRideDetails() {
        if (this.props.rideId === null)
            return;
        this.setState({ loading: true });

        RideDataService.get(this.props.rideId)
            .then((response) => {
                this.setState({ rideDetails: response.data, loading: false });
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
        const renderPlaylistItems = () => {
            let children = [];
            if (this.state.rideDetails?.playlist) {
                this.state.rideDetails?.playlist.songs.map(song => (
                    children.push(<PlaylistItem song={song} />)
                ));
            }
            return children;
        };

        let liveDate = this.state.rideDetails?.ride?.original_air_time ? format(new Date(this.state.rideDetails?.ride?.original_air_time * 1000), "EEEE LLLL do, yyyy - h:mmb") : "Loading...";

        return (
            <>
                {this.state.loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="ride-details">
                        <p className="ride-details--description">{this.state.rideDetails?.ride?.description}</p>
                        <div className="ride-details--details">
                            <h5 className="ride-details--original-time">Live {liveDate}</h5>
                            <div className="ride-details--details--callouts">
                                <DetailCallout title="Rating" value={(this.state.rideDetails?.ride?.overall_estimate * 100).toPrecision(4)} unit="%" />
                                <DetailCallout title="Total Workouts" value={this.state.rideDetails?.ride?.total_workouts.toLocaleString()} />
                                <DetailCallout title="Difficulty" value={this.state.rideDetails?.ride?.difficulty_rating_avg.toPrecision(3)} unit=" / 10" />
                                <DetailCallout title="User Rides" value={this.state.rideDetails?.ride?.total_user_workouts} />
                                <DetailCallout title="Friend Rides" value={this.state.rideDetails?.ride?.total_following_workouts} />
                            </div>
                            <div className="ride-details--details--callouts">
                                <DetailCallout title="Average Output" value={this.state.rideDetails?.averages?.average_total_work} unit=" kj" />
                                <DetailCallout title="Average Distance" value={this.state.rideDetails?.averages?.average_distance} unit=" mi" />
                                <DetailCallout title="Average Calories" value={this.state.rideDetails?.averages?.average_calories} unit=" kcal" />
                                <DetailCallout title="Average Power" value={this.state.rideDetails?.averages?.average_avg_power} unit=" watts" />
                                <DetailCallout title="Average Speed" value={this.state.rideDetails?.averages?.average_avg_speed} unit=" mph" />
                                <DetailCallout title="Average Cadence" value={this.state.rideDetails?.averages?.average_avg_cadence} unit=" rpm" />
                                <DetailCallout title="Average Resistance" value={this.state.rideDetails?.averages?.average_avg_resistance} unit="%" />
                            </div>
                        </div>
                        <div className="ride-details--details-2">
                            <div className="ride-details--playlist">
                                <h4>Playlist</h4>
                                <Scrollbars renderThumbVertical={props => <div {...props} className="playlist-thumb-vertical" />}>
                                    {renderPlaylistItems()}
                                </Scrollbars>
                            </div>
                            <div className="ride-details--chart">
                                {this.state.rideDetails?.target_class_metrics?.target_graph_metrics === undefined ? (
                                    <p>No target metrics available</p>
                                ) : (
                                <Chart options={{
                                    chart: {
                                        id: 'workout-graph',
                                        background: '#191C20'
                                    },
                                    xaxis: {
                                        // categories: this.props.workout.metrics?.aggregate_metrics.map(m => m.second),
                                        tickAmount: this.state.rideDetails?.target_class_metrics?.target_graph_metrics[0].graph_data.upper.length / 10,
                                        // labels: {
                                        //     formatter: this.secondsToMMSS
                                        // }
                                    },
                                    stroke: {
                                        width: 2,
                                        curve: 'smooth',
                                    },
                                    theme: {
                                        mode: 'dark'
                                    },
                                    colors: ['#90EE7E', '#4CAF50', '#90EE7E', '#D7263D', '#FD6A6A', '#D7263D'],
                                    tooltip: {
                                        // y: [
                                        //     {
                                        //         formatter: function (y) {
                                        //             return y + " watts";
                                        //         }
                                        //     },
                                        //     {
                                        //         formatter: function (y) {
                                        //             return y + " rpm";
                                        //         }
                                        //     },
                                        //     {
                                        //         formatter: function (y) {
                                        //             return y + "%";
                                        //         }
                                        //     },
                                        //     {
                                        //         formatter: function (y) {
                                        //             return y + " mph";
                                        //         }
                                        //     },
                                        //     {
                                        //         formatter: function (y) {
                                        //             return y + " bpm";
                                        //         }
                                        //     }
                                        // ]
                                    }
                                }} series={[
                                    {
                                        name: 'Cadence Upper',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "cadence" ? t.graph_data.upper : [])
                                    },
                                    {
                                        name: 'Cadence Average',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "cadence" ? t.graph_data.average : [])
                                    },
                                    {
                                        name: 'Cadence Lower',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "cadence" ? t.graph_data.lower : [])
                                    },
                                    {
                                        name: 'Resistance Upper',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "resistance" ? t.graph_data.upper : [])
                                    },
                                    {
                                        name: 'Resistance Average',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "resistance" ? t.graph_data.average : [])
                                    },
                                    {
                                        name: 'Resistance Lower',
                                        data: this.state.rideDetails?.target_class_metrics?.target_graph_metrics.flatMap(t => t.type === "resistance" ? t.graph_data.lower : [])
                                    },
                                ]} type="line" height="100%" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}
