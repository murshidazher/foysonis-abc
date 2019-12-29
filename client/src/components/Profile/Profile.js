import React from "react";

import IconClose from "../../img/icons/x.svg";

import "./Profile.css";

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    onFormChange = (event) => {
        const value = ((event.target.value).trim());
        const isNull = !(value !== undefined && value !== null && value !== '');
        
        switch (event.target.name) {
            case 'user-name':
                if (isNull)
                    delete this.state.name;
                else
                    this.setState({name: value})
                break;
            default:
                break;
        }
    }

    onProfileUpdate = (data) => {
        fetch(`http://localhost:8080/profile/${this.props.user.id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({ formInput: data })
        }).then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({ ...this.props.user, ...data }); 
            }
        }).catch(console.log());
    }

    render() {
        const { isOpen, toggleModal, user } = this.props;

        return (
            isOpen && <div className="profile-modal">
                <main className="modal-form">
                    <div className="profile-setting__close" alt="close">
                        <svg
                            className="f-icon f-icon-close"
                            shapeRendering="geometricPrecision"
                            onClick={toggleModal}
                            style={{
                                backgroundImage: `url(${IconClose})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center"
                            }}
                        ></svg>
                    </div>
                    <div className="em-20">
                        <fieldset id="sign_up" className="ba b--white ph0 mh0">
                            <div>
                                <div className="face__wrapper face__wrapper__modal">
                                    <div className="face"></div>
                                
            
                                </div>
                                <div className="user__location center">Member Since: {(user.joined).substring(0,10)}</div>
                            </div>
                            <div className="">
                                <label className="db fw6 lh-copy f6" htmlFor="user-name">
                                    Name
                </label>
                                <input
                                    className="pa2 ba bg-transparent b--black hover-black     w-100"
                                    type="text"
                                    name="user-name"
                                    onChange={this.onFormChange}
                                    placeholder={user.name}
                                    id="name"
                                />
                            </div>
                        </fieldset>
                        <div className="bg-blue pa2 center lh-copy mt3" onClick={() => this.onProfileUpdate(this.state)}>
                            <span
                                className="f5 white link  db"
                            >
                                Save
              </span>
                        </div>
                    </div>
                </main>
            </div>
        );
    };
}
  
  export default Profile;
  

