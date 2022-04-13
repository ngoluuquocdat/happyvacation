import React from 'react'
import PlacePicker from '../../PlacePicker'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { VscEdit } from 'react-icons/vsc'
import { IoIosReturnLeft } from 'react-icons/io'
import '../../../Styles/change-email.scss'

class ChangeEmail extends React.Component {

    state = {
        email: '',
        password: '',
        step: 1
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
         // call api to get providers     
        console.log(`GET users/me`);

        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        // get email from redux
        let email = '';
        if(!this.props.reduxData.user) {
            email = 'ngoluuquocdat@gmail.com'
        } else {
            email = this.props.reduxData.user.email;
        }
        this.setState({
            email: email
        })
    }

    componentDidUpdate() {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
    }

    // on input change 
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // confirm password
    confirmPass = () => {
        // do something

        // if success, move on next step
        this.setState({
            step: 2
        })
    }

    // back step 
    backStep = () => {
        const step = this.state.step;
        this.setState({
            step: step > 1 ? step-1 : step 
        })
    }

    // submit email
    submitEmail = () => {

    }


    // on save click 
    handleOnSave = async() => {
        // add check image file, if not null => there's new image file => include that image file to request
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }

        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
        }

        // post to api
        console.log('New profile: ', user);

        let data = new FormData();
        data.append('firstName', this.state.firstName);
        data.append('lastName', this.state.lastName);
        data.append('phone', this.state.phone); 
        if(this.state.file != null) {
            data.append('avatar', this.state.file)
        }

        try {
            let res = await axios.put(
                `${this.baseUrl}/api/Users/me`,
                data,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  
            // save updated user data to redux
            const user = {
                username: res.data.username,
                fullName: `${res.data.firstName} ${res.data.lastName}`,
                phone: res.data.phone,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl
            }
            this.props.saveUserRedux(user);
            // set state with updated user data
            this.setState({
                ...res.data
            })     
            // show toast notify
            toast.success('Update your profile successfully!');
        } catch (error) {
            if (!error.response) {
              toast.error("Network error");
              return;
            }
            if (error.response.status === 401) {
                toast.error("Login to continue");
              console.log(error)
            }
            if (error.response.status === 403) {
                toast.error("Not allowed");
              console.log(error)
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }   
    }

    

    render() {
        const newUrl = this.state.newUrl;
        const { email, step } = this.state;
        return (
            <div className='change-email-container'>
                <div className='change-email-header'>
                    <div className='title'>Change Your Email</div>
                    <div className='sub-title'>To update your email, please confirm by entering password</div>
                </div>
                <div className='change-email-body'>
                    {
                        step == 1 &&
                        <div className='confirm-password'>
                            <div className='email-display'>
                                <span className='title'>Current email</span>
                                <span className='content'>{email}</span>
                            </div>
                            <div className='input-section'>
                                <span className='title'>Password</span>
                                <input className='input-field' type="password" />
                            </div>
                            <div className='submit-wrapper'>
                                <button className="save-btn" onClick={this.confirmPass}>SUBMIT</button>
                            </div>
                        </div>
                    }
                    {
                        step == 2 &&
                        <div className='new-email'>
                            <div className='email-display'>
                                <span className='title'>Current email</span>
                                <span className='content'>{email}</span>
                            </div>
                            <div className='input-section'>
                                <span className='title'>New email</span>
                                <input className='input-field' />
                            </div>
                            <div className='submit-wrapper'>
                                <button className="save-btn" onClick={this.submitEmail}>SUBMIT</button>
                                <button className="back-btn" onClick={this.backStep}>Back</button>
                            </div>
                        </div>
                    }                  
                </div>
            </div>
        )
    }
}

const provider_temp = {
    id: 3,
    firstName: 'Cong Tai',
    lastName: 'Dinh',
    phone: '0905123456',
    email: 'info@hoianexpress.com.vn',
    avatarUrl: 'https://pbs.twimg.com/profile_images/721952678016737280/ppDehV3R_400x400.jpg'
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangeEmail));