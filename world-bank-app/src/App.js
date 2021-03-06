import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Register from "./Components/Register/Register.js";
import LoginPage from "./Components/LoginPage/LoginPage.js";
import Results from "./Components/Results/Results.js";
import SearchPage from "./Components/SearchPage/SearchPage.js";
import Admin from "./Components/Admin";
import { Switch, Route, Redirect } from "react-router-dom";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      results: [],
      compareResults: [],
      isLoggedIn: cookies.get("sessionId") ? true : false,
      username: null,
      admin: false,
    };
  }

  setAdmin = () => {
    const newAdmin = this.state.admin;
    this.logIn();
    this.setState({ admin: !newAdmin });
  };

  setData = (data, compareData) => {
    console.log("changed");
    console.log(data, compareData);
    this.setState({
      results: data ? [...data] : [],
      compareResults: compareData ? [...compareData] : [],
    });
  };

  logIn = (username) => {
    const { cookies } = this.props;
    console.log("logged");
    const currentState = this.state.isLoggedIn;
    if (this.state.isLoggedIn) {
      console.log("removed");
      cookies.remove("sessionId");
      cookies.remove("user_id");
      cookies.remove("email");
      this.setData();
      this.setState({ isLoggedIn: !currentState, username: "" });
    } else {
      this.setState({ isLoggedIn: true, user: username });
    }
    console.log(cookies.getAll());
  };

  exitAdmin = () => {
    this.logIn();
    this.setAdmin();
  };

  render() {
    return (
      <Switch>
        <Route path="/home">
          {this.state.results.length === 0 ? (
            this.state.admin ? (
              <Redirect to="/admin" />
            ) : (
              <SearchPage
                setData={(data, compareData) => this.setData(data, compareData)}
                logIn={() => this.logIn()}
              />
            )
          ) : (
            <Redirect to="/results" />
          )}
        </Route>
        <Route path="/register">
          {this.state.isLoggedIn ? (
            <Redirect to="/home" />
          ) : (
            <Register logIn={(username) => this.logIn(username)} />
          )}
        </Route>
        <Route path="/login">
          {this.state.admin && <Redirect to="/admin" />}
          {this.state.isLoggedIn && !this.state.admin ? (
            <Redirect to="/home" />
          ) : (
            <LoginPage
              logIn={() => this.logIn()}
              setAdmin={() => this.setAdmin()}
            />
          )}
        </Route>
        <Route path="/results">
          {this.state.results.length === 0 ? (
            <Redirect to="/home" />
          ) : (
            <Results
              data={this.state.results}
              admin={this.state.admin}
              exitAdmin={() => this.exitAdmin()}
              compareData={this.state.compareResults}
              setData={() => this.setData()}
              logIn={() => this.logIn()}
            />
          )}
        </Route>
        <Route path="/admin">
          {this.state.admin ? (
            this.state.results.length === 0 ? (
              <Admin
                exitAdmin={() => this.exitAdmin()}
                setData={(data, compareData) => this.setData(data, compareData)}
              />
            ) : (
              <Redirect to="/results" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/">
          {this.state.isLoggedIn ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Switch>
    );
  }
}

export default withCookies(App);
