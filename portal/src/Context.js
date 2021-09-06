import React, { createContext, Component } from "react";

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
    };
  }

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
        {this.props.children}
      </Context.Provider>
    );
  }
}
