import React from "react";

import "./SelectAccount.css";

class SelectAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changed: false,
        }
    }
    
    onSelectChange = async (event) => {
        const value = ((event.target.value).trim());
        await this.props.loadAccountByIndex(value);
    }

    updateChanged = () => {
        this.setState({ changed: true });
    }

    onAccountsUpdate = (data) => {
        fetch(`http://localhost:8080/profile/${this.props.user.id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: this.props.id
            })
        }).then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                this.props.loadAccounts({ ...this.props.user, ...data }); 
            }
        }).catch(console.log());
    }

    render() {
        const { data } = this.props;

        return (
            <div className="custom-select" style={{width: 200 + 'px'}}>
                 <select id='select-account' defaultValue={'DEFAULT'} onChange={this.onSelectChange}>
                     <option value="DEFAULT" key={-1} disabled>Select Your Account ...</option>
            
                {
                    (data !== null && data !== undefined) &&
                        (
                                
                                data.map((value, index) => {
                                        return <option key={index} value={index}>{value}</option>

                        }))     
                }
                      
                </select>
            </div>
        );
    };
}
  
  export default SelectAccount;
  

