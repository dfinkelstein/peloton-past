import React, { Component } from "react";

export class DetailCallout extends Component {

    render() {
        return (
            <div className="detail-callout">
                <p className="detail-callout--title">{this.props.title}</p>
                <p className="detail-callout--value">{this.props.value + (this.props.unit ? this.props.unit : "")}</p>
            </div>
        );
    }
}
