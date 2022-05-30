import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import axios from 'axios';
import HappyVacationLogo from '../../Images/HappyVacation.png';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/ForProvider/provider-register.scss";

class ProviderRegister extends Component {
    state = {
        providerName: '',
        contactPersonName: '',
        providerEmail: '',
        providerPhone: '',

        passwordShow: false,
        confirmPasswordShow: false,

        registration: {},

        providerNameValid: true,
        contactPersonNameValid: true,
        providerEmailValid: true,
        providerPhoneValid: true,
        
        confirmPasswordValid: true,
        isMatch: true,
        accountValid: true,
        isLoading: false,
        isDone: false,
        isRegistered: false
    };

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        window.scrollTo(0, 0);

        // check registration
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }

        try {
            this.setState({
                isLoading: true
            })

            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/registration`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );          
            console.log(res)     
            this.setState({
                registration: res.data,
                isLoading: false,
                isRegistered: true
            })      

        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                return;
            }
            if (error.response.status === 404) {
                //console.log(error.response.data)
                this.setState({
                    isRegistered: false
                })
            }
            if (error.response.status === 401) {
                console.log(error);
                this.props.history.push('/login');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }
    }

    // handle input 
    handleInput = (event) => {
        const key = event.target.name;
        //let isMatch = true;
        // if(key === 'confirmPassword') {
        //     const { password } = this.state;
        //     if(password !== event.target.value) {
        //         isMatch = false;
        //     }
        // }
        this.setState({
            [key]: event.target.value,
            [`${key}Valid`]: event.target.value.length > 0,
        })        
    }


    // handle register 
    handleRegister = async () => {

        // check token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }

        let { providerName, contactPersonName, providerEmail, providerPhone } = this.state;
        providerName = providerName.trim();
        contactPersonName = contactPersonName.trim();
        providerEmail = providerEmail.trim();
        providerPhone = providerPhone.trim();

        this.setState({
            isLoading: true
        })

        const data = {
            providerName: providerName,
            contactPersonName: contactPersonName,
            providerEmail: providerEmail,
            providerPhone: providerPhone
        }

        try {
            let res = await axios.post(
                `${this.baseUrl}/api/Providers/registration`,
                data,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );          
            console.log(res)     
            this.setState({
                isLoading: false,
                isDone: true,
                isRegistered: true
            })      

        } catch (error) {
            if (!error.response) {
              toast.error("Network error");
              console.log(error)
              return;
            }
            if (error.response.status === 400) {
              //console.log(error.response.data)
              toast.error(error.response.data);
            }
            if (error.response.status === 401) {
                console.log(error);
                this.props.history.push('/login');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }  
    }


    render() {
        const { providerName, contactPersonName, providerEmail, providerPhone } = this.state;
        const { providerNameValid, contactPersonNameValid, providerEmailValid, providerPhoneValid } = this.state;
        const isDataValid = providerName !== '' && contactPersonName !== '' && providerEmail !== '' && providerPhone !== '';
        const { isLoading, isDone, isRegistered, registration } = this.state;
        return (
            <div className="provider-register-page-container">
                {
                    isLoading && 
                    <div className="loading-container">
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={50}
                            width={50}
                        />
                    </div>
                }
                <div className="provider-register-form">
                    {
                        isRegistered ?
                        <div className="registered-notification">
                            <div className="logo-section">
                                <img className="logo" src={HappyVacationLogo} alt="Headout" 
                                    onClick={() => this.props.history.push('/')}/>
                            </div>
                            <span className="main-notification">
                                You have already registered! 
                            </span>
                            <p>
                                Your registration id: {registration.id}
                            </p>
                            <p>Company name:&nbsp;{registration.providerName}</p>
                            <p>Contact person:&nbsp;{registration.contactPersonName}</p>
                            <p>Email:&nbsp;{registration.providerEmail}</p>
                            <p>Phone:&nbsp;{registration.providerPhone}</p>
                            <p>If you need any support, feel free to contact us.</p>
                        </div>
                        :
                        <>
                            <div className="logo-section">
                                <img className="logo" src={HappyVacationLogo} alt="Headout" 
                                    onClick={() => this.props.history.push('/')}/>
                            </div>
                            <h3 className="form-header">Register to become a tour provider!</h3>
                            <div className={providerNameValid ? "form-group" : "form-group invalid"}>
                                <p className="label">Company/Provider name</p>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Company name"
                                    name="providerName"
                                    value={providerName}
                                    onChange={this.handleInput}
                                />
                            </div>                        
                            {
                                !providerNameValid &&
                                <div className="valid-warning">
                                    Please fill in this field.                     
                                </div>
                            }  
                            <div className={contactPersonNameValid ? "form-group" : "form-group invalid"}>
                                <p className="label">Contact person name</p>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Contact person name"
                                    name="contactPersonName"
                                    value={contactPersonName}
                                    onChange={this.handleInput}
                                />
                            </div>                        
                            {
                                !contactPersonNameValid &&
                                <div className="valid-warning">
                                    Please fill in this field.                     
                                </div>
                            } 
                            <div className={providerEmailValid ? "form-group" : "form-group invalid"}>
                                <p className="label">Email</p>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Email"
                                    name="providerEmail"
                                    value={providerEmail}
                                    onChange={this.handleInput}
                                />
                            </div>                        
                            {
                                !providerEmailValid &&
                                <div className="valid-warning">
                                    Please fill in this field.                     
                                </div>
                            }      
                            <div className={providerPhoneValid ? "form-group" : "form-group invalid"}>
                                <p className="label">Phone</p>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Phone"
                                    name="providerPhone"
                                    value={providerPhone}
                                    onChange={this.handleInput}
                                />
                            </div>                        
                            {
                                !providerPhoneValid &&
                                <div className="valid-warning">
                                    Please fill in this field.                     
                                </div>
                            }  
                            
                            <button 
                            className={
                                (providerName != '' && contactPersonName != '' && isDataValid) ? 
                                "submit-btn" : "submit-btn disabled"
                            }
                            disabled={!(providerName != '' && contactPersonName != '' && isDataValid)}
                            onClick={this.handleRegister}
                            >
                                Send Request
                            </button>
                        </>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         saveUserRedux: (user) => dispatch({type: 'SAVE_USER', payload: user})
//     }
// }

export default connect(mapStateToProps)(withRouter(ProviderRegister));

