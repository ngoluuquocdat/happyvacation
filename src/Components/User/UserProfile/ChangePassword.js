import React from 'react'
import PlacePicker from '../../PlacePicker'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { VscEdit } from 'react-icons/vsc'
import { IoIosReturnLeft } from 'react-icons/io'
import '../../../Styles/change-email.scss'

class ChangePassword extends React.Component {

    state = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        currentPasswordValid: true,
        newPasswordValid: true,
        confirmPasswordValid: true,
        passwordMatch: true
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        //  // call api to get providers     
        // console.log(`GET users/me`);

        // const token = localStorage.getItem('user-token');
        // if(!token) {
        //     this.props.history.push('/login');
        // }
        // // get email from redux
        // let email = '';
        // if(!this.props.reduxData.user) {
        //     email = 'ngoluuquocdat@gmail.com'
        // } else {
        //     email = this.props.reduxData.user.email;
        // }
        // this.setState({
        //     email: email
        // })
    }

    componentDidUpdate() {
        // const token = localStorage.getItem('user-token');
        // if(!token) {
        //     this.props.history.push('/login', {prevPath: this.props.location.pathname});
        // }
    }

    // on input change 
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    valid = () => {
        let { currentPassword, newPassword, confirmPassword } = this.state;
        let currentPasswordValid = false, newPasswordValid = false, confirmPasswordValid = false, passwordMatch = false;
        if(currentPassword.trim().length > 0) {
            currentPasswordValid = true;
        }
        if(newPassword.trim().length > 0) {
            newPasswordValid = true;
        }
        if(confirmPassword.trim().length > 0) {
            confirmPasswordValid = true;
        }
        if(confirmPassword.trim() === newPassword.trim()) {
            passwordMatch = true;
        }
        
        this.setState({
            currentPasswordValid: currentPasswordValid,
            newPasswordValid: newPasswordValid,
            confirmPasswordValid: confirmPasswordValid,
            passwordMatch: passwordMatch
        })

        return currentPasswordValid && newPasswordValid && confirmPasswordValid && passwordMatch;
    }

    // on save click 
    handleOnSave = async() => {
        // add check image file, if not null => there's new image file => include that image file to request
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }

        if(!this.valid()) {
            toast.warning('Please fill all valid information!');
            return;
        }
        let { currentPassword, newPassword, confirmPassword } = this.state;

        const changePasswordRequest = {
            currentPassword: currentPassword.trim(),
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim()
        }

        // post to api
        try {
            let res = await axios.put(
                `${this.baseUrl}/api/Authen/me/change-password`,
                changePasswordRequest,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  
            toast.success('Update your profile successfully!');
            setTimeout(() => {              
                this.props.history.push('/user/profile');
            }, 1000)                    
        } catch (error) {
            if (!error.response) {
              toast.error("Network error");
              return;
            }
            if (error.response.status === 401) {
                toast.error("Current password is invalid.");
              console.log(error)
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }   
    }

    render() {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        const { currentPasswordValid, newPasswordValid, passwordMatch } = this.state;
        return (
            <div className='change-email-container'>
                <div className='change-email-header'>
                    <div className='title'>Change Your Password</div>
                    <div className='sub-title'>To update your email, please confirm by entering password</div>
                </div>
                <div className='change-email-body'>
                    {
                        <div className='confirm-password'>
                            <div className='email-display'>
                                <span className='title'>Current password</span>
                                <input 
                                    className='input-field' 
                                    name='currentPassword'
                                    value={currentPassword}
                                    type="password"
                                    onChange={this.handleInputChange} 
                                />
                                <span className={currentPasswordValid ? "valid-label" : "valid-label invalid"}>*This field is required.</span>
                            </div>
                            <div className='input-section'>
                                <span className='title'>New password</span>
                                <input 
                                    className='input-field' 
                                    name='newPassword'
                                    value={newPassword}
                                    type="password"
                                    onChange={this.handleInputChange} 
                                />
                                <span className={newPasswordValid ? "valid-label" : "valid-label invalid"}>*This field is required.</span>
                            </div>
                            <div className='input-section'>
                                <span className='title'>Confirm password</span>
                                <input 
                                    className='input-field' 
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    type="password"
                                    onChange={this.handleInputChange} 
                                />
                                {
                                    !passwordMatch && 
                                    <span className={"valid-label invalid"}>*Password not match.</span>
                                }                  
                            </div>
                            <div className='submit-wrapper'>
                                <button className="save-btn" onClick={this.handleOnSave}>SUBMIT</button>
                            </div>
                        </div>
                    }                 
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangePassword));