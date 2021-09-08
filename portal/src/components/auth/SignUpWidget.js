import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { Input, Button, notification } from "antd";

import { UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";

import constants from "../../constants";
import Loader from "../utils/Loader";

export default class SignUpWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      loading: false,
      expanded: false,
    };
  }

   generatePassword = () => {
    let password = '';
    let allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 1; i < 8; i++) {

      let c = Math.floor(Math.random() * allowedCharacters.length + 1);
      password += allowedCharacters.charAt(c); 

    }
  
    return password;
  }

  handleChange = (e, field) => {
    if (field === "firstName") {
      this.setState({ firstName: e.target.value });
    } else if (field === "lastName") {
      this.setState({ lastName: e.target.value });
    } else if (field === "email") {
      this.setState({ email: e.target.value });
    }
  };

  handleSignUp = async () => {
    this.setState({ loading: true });

    let { firstName = "", lastName = "", email = "" } = this.state;

    if (!email) {
      notification.error({
        message: `Email is mandatory.`,
        placement: "topright",
        duration: 3,
      });

      this.setState({ loading: false });
      return false;
    }

    let payload = {
      method: "POST",
      url: constants.users,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        password: this.generatePassword()
      },
    };

    try {
      let response = await axios(payload);

      if (response.status === 201) {
        notification.success({
          message: `An email with credentials has been sent to your friend.`,
          placement: "topright",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: `Error while inviting friend.`,
        placement: "topright",
        duration: 3,
      });
    }

    this.setState({ email: "", firstName: "", lastName: "", loading: false });
  };

  toggleExpand = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    return (
      <div className={`px-5 py-3 ${this.state.expanded ? 'invite-friend-widget-expanded' : 'invite-friend-widget-collapsed'}`}>
        <div>
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <div className="me-3">
              <div>
                <strong>Invite a Friend!</strong>
              </div>
            </div>
            <div onClick={this.toggleExpand}>
              {this.state.expanded ? (
                <DownCircleOutlined />
              ) : (
                <UpCircleOutlined />
              )}
            </div>
          </div>
          {this.state.expanded ? (
            <div>
              <div className="d-flex mb-1">
                <Input
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={(e) => this.handleChange(e, "firstName")}
                  maxLength={100}
                />
              </div>
              <div className="d-flex mb-1">
                <Input
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={(e) => this.handleChange(e, "lastName")}
                  maxLength={100}
                />
              </div>
              <div className="d-flex mb-1">
                <Input
                  placeholder="Email"
                  value={this.state.email}
                  onChange={(e) => this.handleChange(e, "email")}
                  maxLength={100}
                  type={"email"}
                />
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  type="primary"
                  shape="round"
                  size={"small"}
                  onClick={this.handleSignUp}
                >
                  Invite
                </Button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Loader loading={this.state.loading} />
      </div>
    );
  }
}
