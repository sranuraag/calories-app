import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { Layout } from "antd";

import PrivateRoute from './PrivateRoute'; 
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import FoodEntries from './components/foodentries/FoodEntries';
import CreateEditFoodEntry from './components/foodentries/CreateEditFoodEntry';
import PageNotFound from './components/notfound/PageNotFound';

const { Header, Content } = Layout;

export default function routes() {
    return (
      <Router>
        <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Layout style={{ minHeight: "100vh" }}>
          <Header>Header</Header>
            <Content>
              <Switch>
              <PrivateRoute exact path="/food-entries" component={FoodEntries} />
              <PrivateRoute exact path="/create-food-entry" component={CreateEditFoodEntry} />
              <PrivateRoute exact path="/edit-food-entry/:id" component={CreateEditFoodEntry} />
              <Redirect to="/food-entries" />
              </Switch>
            </Content>
        </Layout>
        </Switch>
      </Router>
    );
  }