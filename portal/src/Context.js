import axios from "axios";
import React, { createContext, Component } from "react";

import { notification } from "antd";

import constants from "./constants";

export const Context = createContext();

export class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: 0,
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        daily_limit: 2100,
      },
      contextReady: false,
    };
  }

  componentWillMount = async () => {
    if (window.localStorage.getItem("user_token")) {
      let payload = {
        method: "GET",
        url: `${constants.users}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("user_token")}`,
        },
      };

      try {
        let response = await axios(payload);

        if (response.status === 200) {
          this.setUser(response.data.data);
        }
      } catch (error) {
        notification.error({
          message: `Error while fetching current user details.`,
          placement: "topright",
          duration: 3,
        });
      }
    }

    this.setState({ contextReady: true });
  };

  setUser = (user) => {
    this.setState({ user });
  };

  render() {
    return (
      <Context.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser,
        }}
      >
        {this.state.contextReady ? this.props.children : ""}
      </Context.Provider>
    );
  }
}
