import React, { Component } from "react";
import Chart from 'react-apexcharts';
import { DetailCallout } from "./DetailCallout";

export class WorkoutDetails extends Component {

    secondsToMMSS(value) {
        return Math.floor((value % 3600) / 60) + ":" + String(Math.round(value % 60)).padStart(2, "0");
    }

    render() {
        if (!this.props.workout.metrics)
            return (<></>);
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
                <div className="workout-details--chart">
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
                                    formatter: function (y) {
                                        return y + " watts";
                                    }
                                },
                                {
                                    formatter: function (y) {
                                        return y + " rpm";
                                    }
                                },
                                {
                                    formatter: function (y) {
                                        return y + "%";
                                    }
                                },
                                {
                                    formatter: function (y) {
                                        return y + " mph";
                                    }
                                },
                                {
                                    formatter: function (y) {
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
        );
    }
}
