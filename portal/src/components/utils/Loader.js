import React, { Component } from "react";

import { Spin } from "antd";

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {this.props.loading ? (
          <div className="loader d-flex justify-content-center align-items-center">
            <Spin size={"large"}/>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
