import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import moment from "moment";

import {
  Input,
  Button,
  Select,
  Table,
  DatePicker,
  Space,
  notification,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import constants from "../../constants";
import { Context } from "../../Context";
import Loader from "../utils/Loader";

const { Option } = Select;

export default class AdminReports extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      reportData: {
        lastWeekCount: 0,
        lastToLastWeekCount: 0,
        avgCalories: [],
      },
      loading: false,
    };
  }

  adminreport_columns = [
    {
      title: "User",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Average Calories",
      dataIndex: "avg",
      key: "avg",
    },
  ];

  componentWillMount = async () => {
    if (this.context.user.role !== "Admin") {
      notification.error({
        message: `This page is accessible only for Admin users.`,
        placement: "topright",
        duration: 3,
      });

      this.props.history.push("/foodentries");

      return false;
    }

    this.setState({ loading: true });

    let payload = {
      method: "GET",
      url: `${constants.foodentry}/adminreports`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
      },
    };

    try {
      let response = await axios(payload);

      if (response.status === 200) {
        this.setState({ reportData: response.data.data });
      }
    } catch (error) {
      notification.error({
        message: `Error while fetching Admin Report data.`,
        placement: "topright",
        duration: 3,
      });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="content-main p-5">
        <div className="mb-5">
          <h5>Admin Reports</h5>
        </div>
        <div>
          <strong>Number of Entries Last Week : </strong>
          {this.state.reportData.lastWeekCount}
        </div>
        <div>
          <strong>Number of Entries Last to Last Week : </strong>
          {this.state.reportData.lastToLastWeekCount}
        </div>
        <div className="mt-5">
          <strong>
            Average number of calories added per user for last 7 days
          </strong>
        </div>
        <div>
          <Table
            className="mt-3"
            columns={this.adminreport_columns}
            dataSource={this.state.reportData.avgCalories}
            pagination={true} 
          />
        </div>
        <Loader loading={this.state.loading} />
      </div>
    );
  }
}
