import React from "react";
import "./Signup.css";

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }

  onSubmitSignup = () => {
    fetch("http://localhost:8080/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.userId && data.success === 'true') {
          this.saveAuthTokenInSession(data.token)

          fetch(`http://localhost:8080/profile/${data.userId}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              "Authorization": 'Bearer ' + data.token
            }
          })
            .then(resp => resp.json())
            .then(user => { 
              if (user && user.email) {
                this.props.initializeUser(data).then((data) => {
                  this.props.onRouteChange("home");
                }).catch((error) => {  
                  console.log(error);  
                });
              }
          })
        }
      });
  };


  onSingIn = () => {
    this.props.onRouteChange("signin");
  }

  render() {
    return (
      <div className="w-100">
        <main className="black-80">
          <div className="measure clr--white">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <div className="">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent b--white hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent b--white hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>

                <input
                  className="pa2 input-reset ba bg-transparent b--white hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <button
                type="submit"
                className="btn"
                onClick={this.onSubmitSignup}
              >
                <span className="btn__content">Sign Up</span>
              </button>
            </div>
            <div className="ba dark-gray b--white  pa2 center lh-copy mt3">
              <span
                onClick={this.onSingIn}
                className="f5 link white db"
              >
                Sign In
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Signup;
