import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Register from "./Register";
import LoginPage from "./Components/LoginPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
    };
  }

  async postUser(email, password) {
    const endpoint = "http://localhost:8080/";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const json = response.json();
    return json;
  }

  render() {
    return (
      <div className="App">
        <Register
          registerUser={(email, password) => this.postUser(email, password)}
        />
        <LoginPage />
      </div>
    );
  }
}

export default App;