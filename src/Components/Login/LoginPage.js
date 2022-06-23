import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/login-page.scss";

class Login extends Component {
    state = {
        username: '',
        password: '',
        showPassword: false,
        isUsernameValid: true,
        isPasswordValid: true,
        accountValid: true,
        isCreating: false
    };

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        window.scrollTo(0, 0);
        // add event listener
        window.addEventListener("storage", this.localStorageUpdated);
        // if already have token, redirect to home
        const token = localStorage.getItem('user-token');
        //let isAdminLogin = (this.props.location.pathname.split('/').at(-1)).toLowerCase() === "admin";
        if(token) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        window.removeEventListener("storage", this.localStorageUpdated);
    }

    localStorageUpdated = (e) => {
        console.log(e)
        if(e.key === 'user-token'){         
            if(e.newValue === null) {
                this.props.history.push('/login');
            } else {
                if(this.props.location.state) {
                    const prevPath = this.props.location.state.prevPath;
                    console.log(prevPath)
                    if(prevPath && prevPath.length > 0) {
                        if(this.props.location.state.filter) {
                            this.props.history.push(this.props.location.state.prevPath, {filter: this.props.location.state.filter});
                        } else {
                            this.props.history.push(this.props.location.state.prevPath);
                        }
                    }
                } else {
                    this.props.history.push('/');
                }
            }  
        }       
    }

    // toggle show password
    handleTogglePassword = (event) => {
        event.stopPropagation();
        const showPassword = this.state.showPassword;
        this.setState({
            showPassword: !showPassword
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

    // handle login 
    handleLogin = async () => {
        let {username, password} = this.state;
        username = username.trim();

        let isAdminLogin = (this.props.location.pathname.split('/').at(-1)).toLowerCase() === "admin";

        this.setState({
            isCreating: true
        })

        const data = {
            username: username,
            password: password
        }

        try {
            let res = {};
            if(isAdminLogin) {
                res = await axios.post(
                    `${this.baseUrl}/api/Authen/Login/admin`,
                    data
                ); 
            } else {
                res = await axios.post(
                  `${this.baseUrl}/api/Authen/Login`,
                  data
                );          
            }
            const user = {
                username: res.data.username,
                fullName: res.data.fullName,
                phone: res.data.phone,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl,
                providerId: res.data.providerId
            }
            // set token in local storage
            localStorage.setItem('user-token', res.data.token)
            // set current user in local storage
            this.props.saveUserRedux(user);
            // redirect to previous page
            if(isAdminLogin) {
                this.props.history.push('/for-admin');
                return;
            }
            if(this.props.location.state) {
                const prevPath = this.props.location.state.prevPath;
                if(prevPath && prevPath.length > 0) {
                    if(this.props.location.state.filter) {
                        this.props.history.push(this.props.location.state.prevPath, {filter: this.props.location.state.filter});
                    } else {
                        this.props.history.push(this.props.location.state.prevPath);
                    }
                }
            } else {
                this.props.history.push('/');
            }

        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                return;
            }
            if (error.response.status === 400) {
                console.log(error)
            }
            if (error.response.status === 401) {
                console.log(error);
                this.setState({
                    accountValid: false
                })
            }
            if (error.response.status === 403) {
                console.log(error);
                toast.error("Not allowed");
            }
        } finally {
            // setTimeout(() => {
            //     this.setState({
            //         isCreating: false,
            //     });
            // }, 1000);
        }  
    }


    render() {
        const { username, password } = this.state;
        const { showPassword, isUsernameValid, isPasswordValid, accountValid } = this.state;
        const { isCreating } = this.state;
        let isAdminLogin = (this.props.location.pathname.split('/').at(-1)).toLowerCase() === "admin";

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
                    <h3 className="form-header">{isAdminLogin ? "Login Admin" : "Login"}</h3>
                    {
                        !accountValid &&
                        <div className="account-valid">
                            <AiOutlineCloseCircle />
                            <span>Your Username or Password is invalid, please try again.</span>
                        </div>
                    }
                    <div className={isUsernameValid ? "form-group" : "form-group invalid"}>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={username}
                                onChange={this.handleUsernameInput}
                            />
                    </div>                        
                    {
                        !isUsernameValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }           
                    <div className={isPasswordValid ? "form-group" : "form-group invalid"}>
                        {
                            showPassword ? 
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={this.handlePasswordInput}
                            />
                            :
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={this.handlePasswordInput}
                            />
                        }
                        <button className="show-hide-btn" onClick={this.handleTogglePassword}>
                            {
                                showPassword ? 
                                <AiOutlineEyeInvisible />
                                :
                                <AiOutlineEye />
                            }
                        </button>
                    </div>
                    {
                        !isPasswordValid &&
                        <div className="valid-warning">
                            Please fill in this field.                     
                        </div>
                    }  
                    <button 
                    className={
                        (username != '' && password != '' && isUsernameValid && isPasswordValid) ? 
                        "login-btn" : "login-btn disabled"
                    }
                    disabled={!(username != '' && password != '' && isUsernameValid && isPasswordValid)}
                    onClick={this.handleLogin}
                    >
                        Login
                    </button>
                    {
                        !isAdminLogin &&
                        <div className="form-footer">
                            New to Happy Vacation?
                            <Link className="link" to="/register">Sign up</Link>
                        </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserRedux: (user) => dispatch({type: 'SAVE_USER', payload: user})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

