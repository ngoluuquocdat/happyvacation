import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/login-page.scss";

class Register extends Component {
    state = {
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        passwordShow: false,
        confirmPasswordShow: false,
        usernameValid: true,
        firstNameValid: true,
        lastNameValid: true,
        phoneValid: true,
        emailValid: true,
        passwordValid: true,
        confirmPasswordValid: true,
        isMatch: true,
        accountValid: true,
        isCreating: false
    };

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // valid 
    isValid = () =>  {
        let {username, firstName, lastName, phone, email, password, confirmPassword} = this.state;
        username = username.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();
        phone = phone.trim();
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        let isValid = true;
        if(username === '' || firstName === '' || lastName === '' || phone === '' || 
            email === '' || password === '' || confirmPassword === '') {
                isValid = false;
        }
        if(!phone.match(/\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/)) {
            isValid = false;
        }
        if(!email.match(/^[a-z][a-z0-9_\-\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/)) {
            isValid = false;
        }
        if(password !== confirmPassword) {
            isValid = false;
        }
        
        return isValid;
    }

    // toggle show password/confirm password
    handleTogglePassword = (event) => {
        event.stopPropagation();
        const key = event.target.name ? event.target.name : event.target.closest('button').name;
        const show = this.state[`${key}Show`];
        this.setState({
            [`${key}Show`]: !show
        })
    }

    // handle input 
    handleInput = (event) => {
        const key = event.target.name;
        let isValid = event.target.value.length > 0;
        let isMatch = true;
        if(key === 'confirmPassword') {
            const { password } = this.state;
            if(password !== event.target.value) {
                isMatch = false;
            }
        }
        if(key === 'phone') {
            isValid = event.target.value.match(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/);
        }
        if(key === 'email') {
            isValid = event.target.value.match(/^[a-z][a-z0-9_\-\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/);
        }
        this.setState({
            [key]: event.target.value,
            [`${key}Valid`]: isValid,
            isMatch: isMatch
        })        
    }

    // handle username input
    handleUsernameInput = (event) => {
        this.setState({
            username: event.target.value,
            isUsernameValid: event.target.value.length > 0
        })
    }

    // handle password input
    handlePasswordInput = (event) => {
        this.setState({
            password: event.target.value,
            isPasswordValid: event.target.value.length > 0
        })
    }

    // handle register 
    handleRegister = async () => {
        let {username, firstName, lastName, phone, email, password, confirmPassword} = this.state;
        username = username.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
        console.log(username);
        console.log(password);
        console.log(confirmPassword);

        this.setState({
            isCreating: true
        })

        const data = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }

        try {
            let res = await axios.post(
              `${this.baseUrl}/api/Authen/Register`,
              data
            );          
            console.log(res);
            const user = {
                username: res.data.username,
                fullName: res.data.fullName,
                phone: res.data.phone,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl
            }
            // set token in local storage
            localStorage.setItem('user-token', res.data.token)
            // set current user in local storage
            this.props.saveUserRedux(user);
            // redirect to home page
            this.props.history.push('/');

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
              this.setState({
                accountValid: false
            })
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }  
    }


    render() {
        const { username, firstName, lastName, email, phone, password, confirmPassword } = this.state;
        const { usernameValid, firstNameValid, lastNameValid, phoneValid, emailValid, passwordValid, confirmPasswordValid, isMatch } = this.state;
        const isDataValid = this.isValid();
        const { passwordShow, confirmPasswordShow } = this.state;
        const { isCreating } = this.state;
        return (
            <div className="login-page-container">
                {
                    isCreating && 
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
                <div className="login-form">
                    <h3 className="form-header">Sign up</h3>
                    <div className={usernameValid ? "form-group" : "form-group invalid"}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={this.handleInput}
                        />
                    </div>                        
                    {
                        !usernameValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }  
                    <div className={firstNameValid ? "form-group" : "form-group invalid"}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={firstName}
                            onChange={this.handleInput}
                        />
                    </div>                        
                    {
                        !firstNameValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    } 
                    <div className={lastNameValid ? "form-group" : "form-group invalid"}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={lastName}
                            onChange={this.handleInput}
                        />
                    </div>                        
                    {
                        !lastNameValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }      
                    <div className={phoneValid ? "form-group" : "form-group invalid"}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            value={phone}
                            onChange={this.handleInput}
                        />
                    </div>                        
                    {
                        !phoneValid &&
                        <div className="valid-warning">
                            Invalid data.                     
                        </div>
                    }  
                    <div className={emailValid ? "form-group" : "form-group invalid"}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={this.handleInput}
                        />
                    </div>                        
                    {
                        !emailValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }                       
                    <div className={passwordValid ? "form-group" : "form-group invalid"}>
                        {
                            passwordShow ? 
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={this.handleInput}
                            />
                            :
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={this.handleInput}
                            />
                        }
                        <button className="show-hide-btn" name="password" onClick={this.handleTogglePassword}>
                            {
                                passwordShow ? 
                                <AiOutlineEyeInvisible />
                                :
                                <AiOutlineEye />
                            }
                        </button>
                    </div>
                    {
                        !passwordValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }  
                    <div className={confirmPasswordValid ? "form-group" : "form-group invalid"}>
                        {
                            confirmPasswordShow ? 
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={this.handleInput}
                            />
                            :
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={this.handleInput}
                            />
                        }
                        <button className="show-hide-btn" name="confirmPassword" onClick={this.handleTogglePassword}>
                            {
                                confirmPasswordShow ? 
                                <AiOutlineEyeInvisible />
                                :
                                <AiOutlineEye />
                            }
                        </button>
                    </div>
                    {
                        !(confirmPasswordValid && isMatch) &&
                        <div className="valid-warning">
                            {
                                !confirmPasswordValid ?
                                'Please fill in this field.'  
                                :
                                'Password not match.'                
                            }
                        </div>
                    }  
                    <button 
                    className={
                        (isDataValid) ? 
                        "login-btn" : "login-btn disabled"
                    }
                    disabled={!isDataValid}
                    onClick={this.handleRegister}
                    >
                        Create Account
                    </button>
                    <div className="form-footer">
                        Already have an account?
                        <Link className="link" to="/login">Login</Link>
                    </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserRedux: (user) => dispatch({type: 'SAVE_USER', payload: user})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));

