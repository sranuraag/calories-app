import React, { Component } from "react";

import axios from "axios";
import moment from "moment"; 
import { Button, Table, notification } from "antd";
import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import constants from "../../constants";
import { Context } from "../../Context";
import Loader from "../utils/Loader";

export default class FoodEntries extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {};
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

  componentWillMount = async () => {

    console.log('Inside componentWillMount'); 

    this.setState({ loading: true });

    let role = this.context.user.role; 

    if (role !== 'Admin') {
      this.foodentry_columns = this.foodentry_columns.filter(element => element.title !== 'User'); 
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

    let response = await axios(payload);
    let foodentries = [];

    if (response.status === 200) {
      foodentries = response.data.data;
    } else {
      notification.error({
        message: `Error while fetching Food Entries.`,
        placement: "topright",
        duration: 3,
      });
    }

    console.log('Got data , setting state'); 
    console.log(foodentries); 

    this.setState({ foodentries, loading: false });
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

    let response = await axios(payload); 

    if (response.status === 200) {
      notification.success({
        message: `Food Entry deleted successfully.`,
        placement: "topright",
        duration: 3,
      });
    } else {
      notification.error({
        message: `Error while deleting Food Entry.`,
        placement: "topright",
        duration: 3,
      });
    }

    window.location.reload(); 

    this.setState({ loading: false }); 

  }

  render() {
    return (
      <div className="content-main p-5">
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
        <div>
          <Table
            className="mt-3"
            columns={this.foodentry_columns}
            dataSource={this.state.foodentries}
            pagination={false}
          />
        </div>
        <Loader />
      </div>
    );
  }
}
