import React, { Component } from "react";
import "./Navigation.css";
import Logo from "../Logo/Logo";
import LogoImage from "../../img/logo_main.svg";
import IconMenu from "../../img/icons/menu.svg";
import IconSignOut from "../../img/icons/logout.svg";
import IconCount from "../../img/icons/codesandbox.svg";
import IconBank from "../../img/icons/briefcase.svg";
import IconSettings from "../../img/icons/settings.svg";

import SelectAccount from "../SelectAccount/SelectAccount";


class Navigation extends Component {
  /*
   *
   * @route - keeps track of our current position in page transition
   */
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      update: false
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.data !== this.props.data) {
  //     this.updateChanged();
  //   }
  // }

  // updateChanged = () => {
  //     this.setState({ update: true });
  // }

  onMenuClick = event => {
    this.setState({ menu: !this.state.menu });
  };

  formatDigit = (d) => {
    return (d < 10) ? '0' + d : d;
  }

  onCreateAccount = event => {
    fetch("http://localhost:8080/account/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        id: this.props.id,
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          this.props.loadBankAccounts();
          this.props.loadSelectedAccount();
        }
      })
      .catch(err => console.log(err));
  }

  onSignOut = event => {
    fetch("http://localhost:8080/signout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      }
    })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.logout === 'true') {
          // delete the session storage
          window.sessionStorage.removeItem('token');
          this.props.onRouteChange('logout');
        }
      });
  }

  render() {
    return (
      <div>
        <div
          className={this.state.menu ? "overlay" : ""}
          onClick={this.onMenuClick}
        ></div>
        <div className="side-bar">
          <div className="menu-wrapper">
            <svg
              className="menu-btn"
              onClick={this.onMenuClick}
              shapeRendering="geometricPrecision"
              style={{
                backgroundImage: `url(${IconMenu})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
              }}
            ></svg>
          </div>

          <div className="logo-wrapper">
            <Logo backgroundImage={LogoImage} margin='auto' />
          </div>

          <div className="signout-wrapper">
            <svg
              className="signout-btn"
              onClick={this.onSignOut}
              shapeRendering="geometricPrecision"
              style={{
                backgroundImage: `url(${IconSignOut})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
              }}
            ></svg>
          </div>
        </div>

        <div
          className={
            "side-options z9999 " + (this.state.menu ? "" : "slide-in")
          }
        >
          {(!(this.props.groupType === 'Employee')) &&
                 <div className="side-options__details">
                 <div className="side-options__details__wrapper">
                   <div className="side-options__details__icon">
                     <svg
                       className="f-icon f-icon-count"
                       shapeRendering="geometricPrecision"
                       style={{
                         backgroundImage: `url(${IconCount})`,
                         backgroundRepeat: "no-repeat",
                         backgroundPosition: "center"
                       }}
                     ></svg>
                   </div>
                   <div className="side-options__details__entry">
                     <SelectAccount id={this.props.id} data={this.props.accounts} loadAccountByIndex={this.props.loadAccountByIndex} loadSelectedAccount={this.props.loadSelectedAccount} />
                   </div>
                   <div className="side-options__details__count">{this.formatDigit(this.props.entries)}</div>
                 </div>
               </div>
            }
         

          <div className="face__wrapper">
            <div className="face"></div>
            <div alt="profile setting" className="profile-setting__icon">
                <svg
                  className="f-icon f-icon-settings"
                  shapeRendering="geometricPrecision"
                  onClick={this.props.modalToggle}
                  style={{
                    backgroundImage: `url(${IconSettings})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}
                ></svg>
              </div>
          </div>

          <div className="user">
            <div className="user__name">{this.props.name}</div>
            {(!(this.props.groupType === 'Employee')) &&
              (<div className="user__account link" onClick={this.onCreateAccount}>
                <div className="user__account__icon">
                  <svg
                    className="f-icon f-icon-account"
                    shapeRendering="geometricPrecision"
                    style={{
                      backgroundImage: `url(${IconBank})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center"
                    }}
                  ></svg>
                </div>
              <span className="user__account__content" >Create New Account</span>
              </div>)
            }
          
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
