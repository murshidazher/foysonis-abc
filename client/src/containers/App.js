import React, { Component } from "react";
import moment from "moment";

import Navigation from "../components/Navigation/Navigation";
import TransactionForm from "../components/TransactionForm/TransactionForm";
import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
import Logo from "../components/Logo/Logo";
import Modal from "../components/Modal/Modal";
import Profile from "../components/Profile/Profile";
import LogTable from "../components/LogTable/LogTable";

import ReportTable from "../components/ReportTable/ReportTable";


import LogoImage from "../img/logo_main.svg";
import IconCalendar from "../img/icons/calendar.svg";
import IconCheckingAccount from "../img/icons/globe.svg";
import IconCreditCard from "../img/icons/credit-card.svg";
import IconBusinessAccounts from "../img/icons/briefcase.svg";
import IconDemography from "../img/icons/target.svg";
import IconMoney from "../img/icons/dollar-sign.svg";

import "./App.css";


const initialState = {
  input: "",
  route: "signin", // signin
  logged: false,
  profileOpen: false,
  transactionType: [],
  selectedTransactionIndex: 0,
  report: null,
  user: {
    id: 0,
    role_id: 0,
    group_id: 0,
    group_type: '',
    role_permission: '',
    name: "",
    email: "",
    joined: "MM/DD/YYYY",
    accounts: [],
    selectedIndex: 0,
    balance: 0,
    transactionsHistory: null,
    l_date: "No transactions yet.",
    date: "MM.DD.YYYY — HH:MM",
  },
  
};

class App extends Component {
  /*
   *
   * @route - keeps track of our current position in page transition
   */
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8080/signin', {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": 'Bearer ' + token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:8080/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  this.initializeUser(user).then((data) => {
                    if (!(this.state.user.group_type === 'Employee')) {
                      this.intializeTransaction().then((data) => {
                      this.initializeAccounts().then((data) => { 
                          this.onRouteChange('home');
                        }).catch((error) => {  
                          console.log(error);  
                        });
                      }).catch((error) => {  
                        console.log(error);  
                      });
                    } else {
                      this.intializeTransaction().then((data) => {
                        this.initializeReport().then((data) => {
                          this.onRouteChange('home');
                        }).catch((error) => {  
                          console.log(error);  
                        });
                      }).catch((error) => {  
                        console.log(error);  
                      });
                    }
                  }).catch((error) => {  
                    console.log(error);  
                  });
                }
              })
          }
        })
        .catch(console.log);
    }    
  }

  onChangeSelectedTransaction = (index) => {
    this.setState({ selectedTransactionIndex: index },() => {});
  };

  onInputChange = event => {
    this.setState({ input: (event.target.value).trim() },() => {});
  };

  loadPermission = () => new Promise((resolve, reject) => {
    
    return fetch(`http://localhost:8080/role/permission/${this.state.user.role_id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      }
    })
      .then(resp => resp.json())
      .then(permission => {
        if (permission) {
          this.setState(Object.assign(this.state.user,
            {
              role_permission: permission
            }), () => { 
              resolve(this.state.user.role_permission);
            });
        } else {
          reject('error loadPermission');
        }
      })
  });

  loadGroupType = () => new Promise((resolve, reject) => {
    console.log('loadGroupType');
    console.log(this.state.user);
    console.log(this.state.user.group_id);
    fetch(`http://localhost:8080/role/group/${this.state.user.group_id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      }
    })
      .then(resp => resp.json())
      .then(group => {
        if (group) {
          this.setState(Object.assign(this.state.user,
            {
              group_type: group
            }), () => {
              resolve(this.state.group_type);
            });
        } else {
          reject('error group type');
        }
      })
  });


  loadTransactionType = () => new Promise((resolve, reject) => {

    fetch(`http://localhost:8080/account/transaction/types`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
        }
      })
      .then(resp => resp.json())
      .then(types => {
        if (types) {
          this.setState({ transactionType: types.map(({ id, name }) => [id, name]) }, () => {
            resolve(this.state.transactionType);
          });
          
        } else {
          reject('error load transaction')
        }
      })         
  });

  loadAllUsers = () => new Promise((resolve, reject) => { 

    return fetch(`http://localhost:8080/account/users/all`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
        }
      })
      .then(resp => resp.json())
      .then(accounts => {
        if (accounts) {
          
          let promises = [];
          let temp = {};
          for (let i = 0; i < accounts.length; i++) {
            promises.push(new Promise((resolve, reject) => { 
              temp[accounts[i].id] = { name: accounts[i].name, deposit: 0, withdrawal: 0 }  
              resolve(temp[accounts[i].id]);
            }))
          }

          this.setState({ report: temp }, () => {
            if (temp) {
               resolve(Promise.all(promises))
            } else {
              reject('error all users load ')
            }
          });
        } else {
          reject('error all users load ')
        }
      })         
  });

  loadReport = () => new Promise((resolve, reject) => { 
    
        return fetch(`http://localhost:8080/report`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
            }
          })
          .then(resp => resp.json())
          .then(report => {
            if (report) {

              let promises = [];
              
              for (let i = 0; i < report.length; i++) {
                promises.push(new Promise(async (resolve, reject) => { 
                  if (report[i].t_type_id !== null && report[i].t_type_id !== undefined) {
                    
                    let type = await this.getTransactionType(report[i].t_type_id);
      
                    if (type !== null && type !== undefined) {
                      
                      if (type === 'Withdrawal') {
                        this.setState(Object.assign(this.state.report[report[i].user_account_id],
                          {
                            withdrawal: parseFloat(parseFloat(this.state.report[report[i].user_account_id].withdrawal) + parseFloat(report[i].t_amount))
                          }), () => {
                            resolve(this.state.report[report[i].user_account_id]);
                          });
                      } else if (type === 'Deposit') {
                        
                        this.setState(Object.assign(this.state.report[report[i].user_account_id],
                          {
                            deposit: parseFloat(parseFloat(this.state.report[report[i].user_account_id].deposit) + parseFloat(report[i].t_amount))
                          }), () => {
                            resolve(this.state.report[report[i].user_account_id]);
                          });
                      }
                      
                    } else
                      reject('loadReport type error');
                  } else
                    reject('loadReport null error');
                }))
              }
              resolve(Promise.all(promises));
            }
          })        
  });

  isEmpty = obj => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

  initializeUser = async (data) => {
    let user = await this.loadUser(data);
    user = await this.loadGroupType(); // load user group type
    user = await this.loadPermission(); // load user permission
    return user;
  }

  initializeReport = async () => {
    let report = await this.loadAllUsers();
    report = await this.loadReport();
    return report;
  }

  intializeTransaction = async () => {
    let trans = await this.loadTransactionType();

    return trans;
  }

  initializeAccounts = async () => {
    let acc = await this.loadBankAccounts();

    if (acc) {
      acc = await this.setSelectedAccount(0);
      acc = await this.loadSelectedAccount();
      acc = await this.loadTransactionByIndex(acc);

      if (acc !== -1)
        acc = await this.loadCurrentAccountTransations();
    }
    
      
    return acc;
  }

  loadAccountsByIndex = async (index) => {
    
    let acc = await this.setSelectedAccount(index);
    acc = await this.loadSelectedAccount();

    if (acc !== -1)
      acc = await this.loadCurrentAccountTransations();
      
    return acc;
  }


  handlerLoadAccountsByIndex(index){

      this.loadAccountsByIndex(index).then(data => {
      
      }).catch(error => {
        
      });
    
  }

  loadUser = data => new Promise((resolve, reject) => { 
    if (data === null || data === undefined) {
      reject('Input must be an number');
    } else {
      this.setState(Object.assign(this.state.user,
        {
          id: data.id,
          name: data.name,
          email: data.email,
          joined: data.joined,
          group_id: data.group_id,
          role_id: data.user_role_id,
        }), () => {
          resolve(this.state.user);
        });
    }
  });

  getTransactionType = (index) => new Promise((resolve, reject) => {
    for (let i = 0; i < this.state.transactionType.length; i++) {
      if (this.state.transactionType[i][0] === index)
        return resolve(this.state.transactionType[i][1]);
    }

    return reject('Not Found');
  });

  loadBankAccounts = () => new Promise((resolve, reject) => {

    return fetch(`http://localhost:8080/account/all`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          id: this.state.user.id,
        })
      })
        .then(resp => resp.json())
      .then(resp => {
        if (resp !== null && resp !== undefined && resp !== 'Not found') {
          console.log(resp);
          this.setState(Object.assign(this.state.user,
            {
              accounts: resp.map(({ id }) => id)
            }), () => {
              if (this.state.user.accounts)
                return resolve(true);
              else
                return reject('error loadBankAccounts');
            });
        } else {
          this.setState(Object.assign(this.state.user,
            {
              accounts: []
            }), () => resolve(false));
        }
        })
  });

  loadCurrentAccountTransations = () => new Promise((resolve, reject) => {
    return fetch(`http://localhost:8080/account/transaction/all`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        id: this.state.user.accounts[this.state.user.selectedIndex],
      })
    })
      .then(resp => resp.json())
      .then(transactions => {
        if (transactions !== null && transactions !== 'Unable to get') {
          this.setState(Object.assign(this.state.user,
            {
              transactionsHistory: transactions
            }), () => {
              resolve('done');
            });
        } else {
          resolve('done');
        }
        
      })
  });

  resetState = () => {
    this.setState({...initialState},() => {});
  }

  loadSelectedAccount = () => new Promise((resolve, reject) => {
    // Reset transaction History
    this.setState(Object.assign(this.state.user, {
      transactionsHistory: null
    }));

    return fetch(`http://localhost:8080/account/details`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        id: this.state.user.id,
        account_id: this.state.user.accounts[this.state.user.selectedIndex],
      })
    })
      .then(resp => resp.json())
      .then(account => {
        this.setState(Object.assign(this.state.user,
          {
            balance: account.balance
          }), () => {
            return resolve(account.last_transaction_id);
          });           
      })
  });

  loadTransactionByIndex = (index) => new Promise((resolve, reject) => {

    if (index !== 0 && index !== null && index !== undefined) {
      return fetch(`http://localhost:8080/account/transaction/all/${index}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
        },
      }).then(resp => resp.json())
        .then(data => {
          if (data.length !== 0) {
            this.setState(Object.assign(this.state.user,
              {
                l_date: moment(data.t_date).format('lll')
              }), () => {
                resolve(true);
              });
          } else {
            this.setState(Object.assign(this.state.user,
              {
                l_date: "No transactions yet."
              }), () => {
                resolve(-1);
              });
          }
        }).catch(console.log());
    } else {
      this.setState(Object.assign(this.state.user,
        {
          l_date: "No transactions yet."
        }), () => {
          resolve(-1);
        });
    }
  });

  setSelectedAccount = (index) => new Promise((resolve, reject) => {
    this.setState(Object.assign(this.state.user,
      {
        selectedIndex: index
      }), () => {
        return resolve(this.state.user.selectedIndex);
      });
  });

  onSubmit = () => {
    fetch("http://localhost:8080/account/transaction", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        user_id: this.state.user.id,
        bank_account_id: this.state.user.accounts[this.state.user.selectedIndex],
        transaction_id: this.state.transactionType[this.state.selectedTransactionIndex][0],
        amount: this.state.input,
      })
    })
      .then(response => response.json())
      .then(response => async () => {
        if (response) {
            const { balance, last_transaction_id } = response;
            this.setState(Object.assign(this.state.user,
              {
                balance: balance,
                l_date: last_transaction_id
              }),() => {});
        }
      })
      .catch(err => console.log(err));
  };

  updateAccountBalance = () => {
    this.setState(Object.assign(this.state.user,
      {
        balance: this.state.user.accounts.balance,
      }),() => {});
  }

  onRouteChange = route => {
    if (route === "logout") {
      this.setState({ ...initialState }, () => {this.setState({ route: route })})
    } else if (route === "home") {
      this.setState({ logged: true }, () => {
        this.setState({ route: route });
      });
    } else {
      this.setState({ route: route });
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      profileOpen: !prevState.profileOpen
    }),() => {})
  }

  componentDidUpdate(nextProps, nextState){
    
    return (this.state.route !== nextState.route)
      || (this.state.user.id !== nextState.user.id);
  }

  render() {
    return (
      <div className="App">
        { this.state.profileOpen &&
          <Modal>
            <Profile isOpen={this.state.profileOpen} toggleModal={this.toggleModal} user={this.state.user} loadUser={this.loadUser} />
          </Modal>
        }
        {this.state.route === "home" ? (
          <div>
            <Navigation onRouteChange={this.onRouteChange}
              modalToggle={this.toggleModal}
              name={this.state.user.name}
              id={this.state.user.id}
              loadAccountByIndex={this.loadAccountsByIndex}
              selectedIndex={this.state.user.selectedIndex}
              accounts={this.state.user.accounts}
              loadSelectedAccount={this.loadSelectedAccount}
              groupType={this.state.user.group_type}
              />
            <div className="ml">
              <div className="wrapper">
              { ((this.state.report) && (this.state.user.group_type === 'Employee')) ?
                  (<div className="table-report">
                  
                  <div className="table-report__tile">Transaction Summary for { moment(new Date()).format('ll') } from 0:00 to 23:59 </div>
                  
                  {!(this.isEmpty(this.state.report)) ?
                  <ReportTable headers={['Customer Name', 'Sum of Withdrawals', 'Sum of Deposits']} data={this.state.report} getTransactionType={this.getTransactionType}/>: 'No transactions happened.'
                  }
                  </div>)
                  : (
                    <div>
                    <div className="sub__title">Account Details </div>
                <div className="box">
                  <div className="box__left blue">
                    <div className="box__content">
                      <div className="box__details">
                        <div className="box__details__icon-wrapper">
                          <svg
                            className="f-icon f-icon-calendar"
                            shapeRendering="geometricPrecision"
                            style={{
                              backgroundImage: `url(${IconMoney})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center"
                            }}
                          ></svg>
                        </div>
                        <div className="box__details__content">
                          { parseFloat(this.state.user.balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box__right blue-light">
                    <div className="box__content">
                    <div className="box__details">
                        <div className="box__details__icon-wrapper">
                          <svg
                            className="f-icon f-icon-calendar"
                            shapeRendering="geometricPrecision"
                            style={{
                              backgroundImage: `url(${IconCalendar})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center"
                            }}
                          ></svg>
                        </div>
                        <div className="box__details__content">
                          {(this.state.user.l_date !== 0) ? this.state.user.l_date :
                            "No transactions yet."
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <TransactionForm
                    onInputChange={this.onInputChange}
                    onSubmit={this.onSubmit}
                    transactionType={this.state.transactionType}
                    onChangeSelectedTransaction={this.onChangeSelectedTransaction}
                    selectedIndex={this.state.selectedTransactionIndex}
                  />
                </div>

                {(this.state.user.transactionsHistory) &&
                  <div className="table-report">
                  <div className="table-report__tile">Transaction Log History </div>
                  
                  <LogTable headers={['Date', 'Transaction Type', 'Amount', 'Balance']} data={this.state.user.transactionsHistory} getTransactionType={this.getTransactionType}/>
                  </div>
                }
                
                </div>
                )
                }
                
                </div>
            </div>
          </div>
        ) : !(window.sessionStorage.getItem('token')) && (
          <div className="content">
              <div className="content__left">
              {/* <video id="videobcg" preload="auto" autoPlay={true} loop="loop" muted="muted" volume="0">
                  <source src="https://ak6.picdn.net/shutterstock/videos/1023857446/preview/stock-footage-montreal-canada-february-using-a-vintage-computer-from-the-late-s-early-s-to-work.mp4" type="video/mp4" />
                  <source src="https://ak6.picdn.net/shutterstock/videos/1023857446/preview/stock-footage-montreal-canada-february-using-a-vintage-computer-from-the-late-s-early-s-to-work.webm" type="video/webm" />
                        Sorry, your browser does not support HTML5 video.
              </video> */}
                <div className="logo-top-wrapper">
                  <Logo backgroundImage={LogoImage} margin='0'/>
                  
                </div>
                
                <div className="heading mth">
                We're here to help you.
                </div>
                <div className="features">
                  <div className="feature__block">
                    <div className="feature__icon">
                      <svg
                        className="f-icon-pointer"
                        shapeRendering="geometricPrecision"
                        style={{
                          backgroundImage: `url(${IconCheckingAccount})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center"
                        }}
                      ></svg>
                    </div>
                    <div className="feature__heading">Checking Accounts</div>
                    <div className="para feature__content">Choose the checking account that works best for you. </div>
                  </div>
                  <div className="feature__block">
                  <div className="feature__icon">
                      <svg
                        className="f-icon-pointer"
                        shapeRendering="geometricPrecision"
                        style={{
                          backgroundImage: `url(${IconCreditCard})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center"
                        }}
                      ></svg>
                    </div>
                    <div className="feature__heading">Credit Cards</div>
                    <div className="para feature__content">Choose from our Chase credit cards to help you buy what you need. </div>
                  </div>
                  <div className="feature__block">
                  <div className="feature__icon">
                      <svg
                        className="f-icon-pointer"
                        shapeRendering="geometricPrecision"
                        style={{
                          backgroundImage: `url(${IconBusinessAccounts})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center"
                        }}
                      ></svg>
                    </div>
                    <div className="feature__heading">Business Accounts</div>
                    <div className="para feature__content">You’ll receive guidance from a team of business professionals.</div>
                  </div>
                  <div className="feature__block">
                  <div className="feature__icon">
                      <svg
                        className="f-icon-pointer"
                        shapeRendering="geometricPrecision"
                        style={{
                          backgroundImage: `url(${IconDemography})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center"
                        }}
                      ></svg>
                    </div>
                    <div className="feature__heading">Planning & Investments</div>
                    <div className="para feature__content">We offers insights, expertise and tools to help you reach your goals.</div>
                  </div>
                </div>
                
              </div>
              <div className="content__right">
                <div className="heading clr--white">
                  Simplify your payments with your digital bank.
                </div>
                <div className="heading-break ">
        
                </div>
                <div className="para clr--white mt-para">
                Speed up your payments by eliminating cumbersome and complex processes and with automated electronic tools.
                </div>
                {  
                  this.state.route === "signin" ?
                      <Login initializeUser={this.initializeUser} onRouteChange={this.onRouteChange} /> :
                      <Signup initializeUser={this.initializeUser} onRouteChange={this.onRouteChange} /> 
                }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
