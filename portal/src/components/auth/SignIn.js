import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import { Input, Button, notification } from "antd";

import constants from "../../constants";
import Loader from "../utils/Loader";
import { Context } from "../../Context";

export default class SignIn extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false,
    };
  }

  handleChange = (e, field) => {
    if (field === "email") {
      this.setState({ email: e.target.value });
    } else if (field === "password") {
      this.setState({ password: e.target.value });
    }
  };

  handleSignIn = async () => {
    this.setState({ loading: true });

    let { email = "", password = "" } = this.state;

    if (!(email && password)) {
      notification.error({
        message: `Email and Password are mandatory.`,
        placement: "topright",
        duration: 3,
      });

      this.setState({ loading: false });
      return false;
    }

    let payload = {
      method: "POST",
      url: constants.login,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
      },
    };

    try {
      let response = await axios(payload);

      if (response.status === 200) {
        window.localStorage.setItem("user_token", response.data.jwt);
        this.context.setUser(response.data.user);

        this.props.history.push("/food-entries");
      }
    } catch (error) {
      notification.error({
        message: `Error during Sign In.`,
        placement: "topright",
        duration: 3,
      });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="d-flex justify-content-center align-items-center main">
        <div>
          <div className="mb-5 d-flex justify-content-center">
            <h6>Calories App - Sign In</h6>
          </div>
          <div className="d-flex mb-4">
            <label for="email" className="field-label">
              Email
            </label>
            <Input
              placeholder="Email"
              value={this.state.email}
              onChange={(e) => this.handleChange(e, "email")}
              maxLength={100}
              type={"email"}
            />
          </div>
          <div className="d-flex mb-4">
            <label for="password" className="field-label">
              Password
            </label>
            <Input
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.handleChange(e, "password")}
              maxLength={100}
              type={"password"}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Button
              type="primary"
              shape="round"
              size={"large"}
              onClick={this.handleSignIn}
            >
              Sign In
            </Button>
          </div>
          <div className="d-flex justify-content-center">
            <p>
              Click <Link to="/signup">here</Link> to Sign Up
            </p>
          </div>
        </div>
        <Loader loading={this.state.loading} />
      </div>
    );
  }
}
