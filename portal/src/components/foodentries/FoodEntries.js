import React, { Component } from "react";

import axios from "axios";
import moment from "moment"; 
import { Button, Table, notification, Input, DatePicker } from "antd";
import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import constants from "../../constants";
import { Context } from "../../Context";
import Loader from "../utils/Loader";
import SignUpWidget from "../auth/SignUpWidget";

const { RangePicker } = DatePicker;

export default class FoodEntries extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      daily_limit_exceeded_data: [],
      foodentries: [],
      searchText: ''
    };
  }

  foodentry_columns = [
    {
      title: "Food",
      dataIndex: "food",
      key: "food",
    },
    {
      title: "Calories",
      dataIndex: "calories",
      key: "calories",
    },
    {
      title: "Date/Time",
      dataIndex: "datetime",
      key: "datetime",
      render: (text, record) => {
        return (
          <span>
            {moment(text).format("DD-MMM-YYYY HH:mm:ss")}
          </span>
        );
      },
    },
    {
      title: "User",
      dataIndex: "email",
      key: "email",
    }, 
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (text, record) => {
        return (
          <span onClick={(e) => { this.handleEditFoodEntry(record) }}>
            <EditOutlined />
          </span>
        );
      },
    },
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (text, record) => {
        return (
          <span onClick={(e) => { this.handleDeleteFoodEntry(record) }}>
            <DeleteOutlined />
          </span>
        );
      },
    },
  ];

  daily_limit_exceeded_columns = [
    {
      title: "Date",
      dataIndex: "formatted_date",
      key: "formatted_date",
    },
    {
      title: "Total Calories",
      dataIndex: "total_calories",
      key: "total_calories",
    },
    {
      title: "User",
      dataIndex: "email",
      key: "email",
    }
  ];

  componentWillMount = async () => {

    this.setState({ loading: true });

    let role = this.context.user.role; 

    if (role !== 'Admin') {
      this.foodentry_columns = this.foodentry_columns.filter(element => element.title !== 'User'); 
      this.daily_limit_exceeded_columns = this.daily_limit_exceeded_columns.filter(element => element.title !== 'User'); 
    }

    let user_token = `Bearer ${window.localStorage.getItem("user_token")}`;

    let payload = {
      method: "GET",
      url: constants.foodentry,
      headers: {
        "Content-Type": "application/json",
        Authorization: user_token,
      },
    };

    let foodentries = [];
    let daily_limit_exceeded_data = []; 
    let response; 

    try {
      response = await axios(payload);
  
      if (response.status === 200) {
        foodentries = response.data.data;
      }
    } catch(error) {
      notification.error({
        message: `Error while fetching Food Entries.`,
        placement: "topright",
        duration: 3,
      });
    }

    payload = {
      method: "GET",
      url: `${constants.daily_limit_exceeded_report}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: user_token,
      },
    };

    try {

      response = await axios(payload);

      if (response.status === 200) {
        daily_limit_exceeded_data = response.data.data; 
      }

    } catch(error) {
      notification.error({
        message: `Error while fetching Daily Limit Exceeded report.`,
        placement: "topright",
        duration: 3,
      });
    }

    this.setState({ foodentries, daily_limit_exceeded_data, loading: false });
  };

  handleCreateFoodEntry = () => {
    this.props.history.push('/create-food-entry')
  }

  handleEditFoodEntry = (record) => {
    this.props.history.push({
      pathname: `/edit-food-entry/${record.id}`,
      state: {
        id: record.id,
        food: record.food,
        calories: record.calories,
        datetime: record.datetime,
        user_id: record.user_id
      }
    })
  }

  handleDeleteFoodEntry = async (record) => {
    this.setState({ loading: true }); 

    let payload = {
      method: 'DELETE',
      url: `${constants.foodentry}/${record.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
      },
    }

    try {
      let response = await axios(payload); 

      if (response.status === 200) {
        notification.success({
          message: `Food Entry deleted successfully.`,
          placement: "topright",
          duration: 3,
        });
      }
    } catch(error) {
      notification.error({
        message: `Error while deleting Food Entry.`,
        placement: "topright",
        duration: 3,
      });
    }

    window.location.reload(); 

    this.setState({ loading: false }); 

  }

  handleSearchTextChange = (e) => {
    this.setState({ searchText: e.target.value }); 
  }

  render() {
    return (
      <div className="content-main p-5 mb-5">
        <div className="d-flex justify-content-between mb-5">
          <h5>Food Entries</h5>
          <Button
            type="primary"
            shape="round"
            size={"large"}
            onClick={this.handleCreateFoodEntry}
          >
            Create Food Entry
          </Button>
        </div>
        <div className="d-flex justify-content-end">
        <Input
            placeholder="Search Food"
            value={this.state.searchFood}
            onChange={this.handleSearchTextChange}
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div>
          <Table
            className="mt-3"
            columns={this.foodentry_columns}
            dataSource={this.state.foodentries.filter(element => element.food.toLowerCase().includes(this.state.searchText.toLowerCase()))}
            pagination={true}
            rowClassName={(record, index) => record.total_calories > record.daily_limit ? 'daily-limit-exceeded' : 'daily-limit-not-exceeded'}
          />
        </div>
        <div className="mt-3"><strong>Daily Limit Exceeded Report</strong></div>
        <div>
          <Table
            className="mt-3"
            columns={this.daily_limit_exceeded_columns}
            dataSource={this.state.daily_limit_exceeded_data}
            pagination={true}
          />
        </div>
        <div className="signup-widget">
          <SignUpWidget />
        </div>
        <Loader />
      </div>
    );
  }
}
