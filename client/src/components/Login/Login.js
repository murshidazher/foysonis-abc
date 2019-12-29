import React from "react";
import "./Login.css";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loginEmail: "",
      loginPassword: ""
    };
  }

  onEmailChange = event => {
    this.setState({ loginEmail: event.target.value });
  };

  onPasswordChange = event => {
    this.setState({ loginPassword: event.target.value });
  };

  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }

  onSubmitLogin = () => {
    fetch("http://localhost:8080/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword
      })
    })
      .then(resp => resp.json())
      .then(data => {
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

  render() {
    const { onRouteChange } = this.props;
    return (
      <div className="w-100">
        <main className="black-80">
          <div className="measure clr--white">
            <fieldset id="login" className="ba b--transparent ph0 mh0">
              <div className="">
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
                onClick={this.onSubmitLogin}
              >
                <span className="btn__content">Sign in</span>
              </button>
            </div>
            <div className="ba dark-gray b--white  pa2 center lh-copy mt3">
              <span
                onClick={() => onRouteChange("signup")}
                className="f5 link white db"
              >
                Sign up
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Login;
