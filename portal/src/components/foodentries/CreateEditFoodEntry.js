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

export default class CreateEditFoodEntry extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      id: "",
      food: "",
      calories: "",
      datetime: "",
      loading: false,
      user_id: "",
      users: [],
    };
  }

  componentWillMount = async () => {
    if (this.context.user.role === "Admin") {
      let payload = {
        method: "GET",
        url: constants.users,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
        },
      };

      let response = await axios(payload);

      if (response.status === 200) {
        this.setState({ users: response.data.data });
      }
    }

    if (window.location.pathname.split("/")[1] === "edit-food-entry") {
      this.setState({ editing: true });

      if (!this.props.location.state) {
        this.props.history.push("/food-entries");
        return false;
      }

      let { id, food, calories, datetime, user_id } = this.props.location.state;

      this.setState({ id, food, calories, datetime });

      if (this.context.user.role === "Admin") {
        this.setState({ user_id });
      }
    }
  };

  handleChange = (e, field) => {
    if (field === "food") {
      this.setState({ food: e.target.value });
    } else if (field === "calories") {
      let calories = e.target.value;

      if (isNaN(calories)) {
        notification.error({
          message: `Calories should be a number.`,
          placement: "topright",
          duration: 3,
        });
      } else {
        this.setState({ calories: e.target.value });
      }
    }
  };

  handleDateChange = (value, dateString) => {

    if (value) {
      console.log(value.valueOf());

      let datetime = value.valueOf();

      this.setState({ datetime });
    } else {
      this.setState({ datetime: '' }); 
    }
  };

  disabledDate = (current) => {
    return current.valueOf() > Date.now();
  };

  handleSave = async () => {
    let payload;
    let response;

    this.setState({ loading: true });

    let { id, food, calories, datetime, editing, user_id } = this.state;

    if (!(food && calories && datetime)) {
      notification.error({
        message: `Food, Calories and Date/Time are mandatory.`,
        placement: "topright",
        duration: 3,
      });

      this.setState({ loading: false });

      return false;
    }

    if (this.context.user.role === "Admin" && !user_id) {
      notification.error({
        message: `User selection is mandatory for Admin user.`,
        placement: "topright",
        duration: 3,
      });
    }

    if (this.context.user.role !== "Admin" && user_id) {
      notification.error({
        message: `User selection can be done only by Admin user.`,
        placement: "topright",
        duration: 3,
      });
    }

    if (editing) {
      payload = {
        method: "PUT",
        url: `${constants.foodentry}/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
        },
        data: {
          food,
          calories,
          datetime,
          user_id,
        },
      };

      response = await axios(payload);

      if (response.status === 200) {
        notification.success({
          message: `Food Entry edited successfully.`,
          placement: "topright",
          duration: 3,
        });
      } else {
        notification.error({
          message: `Error while editing Food Entry.`,
          placement: "topright",
          duration: 3,
        });
      }
    } else {
      payload = {
        method: "POST",
        url: constants.foodentry,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
        },
        data: {
          food,
          calories,
          datetime,
          user_id,
        },
      };

      response = await axios(payload);

      if (response.status === 201) {
        notification.success({
          message: `Food Entry created successfully.`,
          placement: "topright",
          duration: 3,
        });
      } else {
        notification.error({
          message: `Error while creating Food Entry.`,
          placement: "topright",
          duration: 3,
        });
      }
    }

    this.setState({ loading: false });

    this.props.history.push("/food-entries");
  };

  handleUserChange = (value) => {
    this.setState({ user_id: value });
  };

  render() {
    return (
      <div className="content-main p-5">
        <div className="mb-3">
          <Link to="/food-entries">
            <div className="d-flex align-items-center">
              <ArrowLeftOutlined />
              <span className="ms-2">Back</span>
            </div>
          </Link>
        </div>
        <div className="d-flex justify-content-between mb-5">
          {this.state.editing ? (
            <h5>Edit Food Entry ({this.state.id})</h5>
          ) : (
            <h5>Create Food Entry</h5>
          )}
        </div>
        <div className="d-flex mb-3">
          <label for="food" className="field-label">
            Food Name
          </label>
          <Input
            placeholder="Food Name"
            value={this.state.food}
            onChange={(e) => this.handleChange(e, "food")}
            maxLength={100}
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div className="d-flex mb-3">
          <label for="calories" className="field-label">
            Calories
          </label>
          <Input
            placeholder="Calories"
            value={this.state.calories}
            onChange={(e) => this.handleChange(e, "calories")}
            maxLength={10}
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div className="d-flex mb-3">
          <label for="datetime" className="field-label">
            Date/Time
          </label>
          <Space direction="vertical" size={12}>
            <DatePicker
              showTime
              onChange={this.handleDateChange}
              onOk={this.handleDateOK}
              disabledDate={this.disabledDate}
              value={this.state.datetime ? moment(this.state.datetime) : ""}
            />
          </Space>
        </div>
        {this.context.user.role === "Admin" ? (
          <div className="d-flex mb-3">
            <label for="user" className="field-label">
              User
            </label>
            <Select
              value={this.state.user_id}
              onChange={this.handleUserChange}
              style={{ width: 300 }}
            >
              {this.state.users.map((element) => (
                <Option value={element.id}>{element.email}</Option>
              ))}
            </Select>
          </div>
        ) : (
          ""
        )}
        <div>
          <Button
            type="primary"
            shape="round"
            size={"large"}
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
        <Loader loading={this.state.loading} />
      </div>
    );
  }
}
