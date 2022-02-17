import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import invalidChars from "../../invalidChars";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import Network from "../Network";

const network = new Network();

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: "",
      passwordInput: "",
      confirmPasswordInput: "",
      passwordMatch: false,
      invalidChars: invalidChars,
      success: false,
      error: false,
    };

    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleConfirmPasswordInput =
      this.handleConfirmPasswordInput.bind(this);
  }

  async registerUser(username, password) {
    try {
      const json = await network.registerUser(username, password);
      console.log(json);
      if (json.status === 200) {
        console.log("test");
        this.handleLogIn();
        this.setState({ success: true });
      } else if (json.status >= 400 && json.status < 600) {
        throw new Error("Bad response from server.");
      } else {
        this.setState({ success: false, error: json.error });
      }
    } catch (e) {
      this.setState({ success: false, error: e.toString() });
    }
  }

  isUsernameValid(username) {
    if (username.includes(this.state.invalidChars) || username.length < 8) {
      return false;
    } else if (!username) {
      return false;
    } else {
      return true;
    }
  }

  isPasswordValid(password) {
    if (password.length > 25) {
      return false;
    } else if (!password) {
      return false;
    } else {
      return true;
    }
  }

  doPasswordsMatch(password, confirmedPassword) {
    if (password === confirmedPassword) {
      return true;
    } else {
      return false;
    }
  }

  isAccountValid() {
    if (
      this.isUsernameValid(this.state.usernameInput) &&
      this.isPasswordValid(this.state.passwordInput) &&
      this.doPasswordsMatch(
        this.state.passwordInput,
        this.state.confirmPasswordInput
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  getWarning(input) {
    return <Alert variant="danger">This {input} is not valid.</Alert>;
  }

  getPass(input) {
    return <Alert variant="success">This {input} is valid.</Alert>;
  }

  handleUsernameInput(e) {
    this.setState({ usernameInput: e.target.value });
  }

  handlePasswordInput(e) {
    this.setState({ passwordInput: e.target.value });
  }

  handleConfirmPasswordInput(e) {
    this.setState({ confirmPasswordInput: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.isAccountValid) {
      this.registerUser(this.state.usernameInput, this.state.passwordInput);
    }
  }

  handleLogIn() {
    this.props.logIn(this.state.usernameInput);
  }

  getRegister() {
    return (
      <div className="spacing">
        <div className="registerPage">
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="username-label">Email address</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter email"
                minLength="5"
                maxLength="100"
                required
                value={this.state.usernameInput}
                onChange={(e) => this.handleUsernameInput(e)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            {this.isUsernameValid(this.state.usernameInput)
              ? this.getPass("username")
              : this.getWarning("username")}

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="password-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                minLength="8"
                maxLength="20"
                required
                value={this.state.passwordInput}
                onChange={(e) => this.handlePasswordInput(e)}
              />
              <Form.Text id="passwordHelpBlock" muted>
                Your password must be 8-20 characters long, contain letters and
                numbers, and must not contain spaces, special characters, or
                emoji.
              </Form.Text>
            </Form.Group>

            {this.isPasswordValid(this.state.passwordInput)
              ? this.getPass("password")
              : this.getWarning("password")}

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label className="password-label">
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                minLength="8"
                maxLength="20"
                required
                value={this.state.confirmPasswordInput}
                onChange={(e) => this.handleConfirmPasswordInput(e)}
              />
            </Form.Group>

            {this.doPasswordsMatch(
              this.state.passwordInput,
              this.state.confirmPasswordInput
            ) ? (
              <Alert variant="success">Passwords match!</Alert>
            ) : (
              <Alert variant="danger"> Passwords do not match.</Alert>
            )}

            <Form.Group
              data-testid="register-checkbox-unchecked"
              className="mb-3"
              controlId="formBasicCheckbox"
            >
              <Form.Check
                type="checkbox"
                label="By ticking this box, you agree that you have read the Terms and Conditions."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
            <Form.Group className="mb-3" controlId="formBasicButton">
              <Form.Text className="text">Already have an account? </Form.Text>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.getRegister()}
        {this.state.error ? (
          <div class="alert alert-danger" role="alert">
            Oops! Something went wrong. "{this.state.error}".
          </div>
        ) : null}
        {this.state.success ? this.redirect() : null}
      </div>
    );
  }
}

export default Register;