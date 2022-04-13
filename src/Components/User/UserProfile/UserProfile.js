import React from 'react'
import PlacePicker from '../../PlacePicker'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { VscEdit } from 'react-icons/vsc'
import { IoIosReturnLeft } from 'react-icons/io'
import '../../../Styles/user-profile.scss'

class UserProfile extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        newUrl: '',
        file: null,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
         // call api to get providers     
        console.log(`GET users/me`);

        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        try {
            let res = await axios.get(
                `${this.baseUrl}/api/Users/me`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );          
            // console.log(res);
            const user = {
                username: res.data.username,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                phone: res.data.phone,
                email: res.data.email,
                avatarUrl: res.data.avatarUrl
            }
            // set state
            this.setState({
                ...res.data
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                //fake api response
                const resProvider = provider_temp;
                // set state`   
                this.setState({
                    ...resProvider
                }); 
                return;
            }
            if (error.response.status === 400) {
                console.log(error)
            }
            if (error.response.status === 401) {
                console.log(error);
             // redirect to login page or show notification
             this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    componentDidUpdate() {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
    }

    // avatar image change
    onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.setState({
            newUrl: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
          });
        }
    }

    // click email edit
    handleEmailEditClick = () => {
        this.props.history.push('/user/profile/email', {prevPath: this.props.location.pathname});
    }

    // on input change 
    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // place pick
    onPlacePick = (place) => {
        this.setState({
            newPlace: place
        })
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
        const { firstName, lastName, phone, email, address, description, avatarUrl} = this.state;
        const avatarUrl_real = newUrl.length === 0 ? `url('${this.baseUrl+avatarUrl}')` : `url('${newUrl}')`;
        return (
            <div className='profile-page-container'>
                <div className='profile-header'>
                    <div className='title'>Your Profile</div>
                    <div className='sub-title'>Manage profile information and account security</div>
                </div>
                <div className='profile-body'>
                    <div className='body-left'>
                        <div className="provider-avatar" style={{backgroundImage: avatarUrl_real}}> 
                            <div className="avatar-edit">
                                <label htmlFor='avatar'>Edit</label>
                                <input id='avatar' type='file' onChange={this.onImageChange}/>
                            </div>
                        </div>
                    </div>
                    <div className='body-right'>
                        <div className='name-section'>
                            <div className='form-group'>
                                <label className="form-title">First Name</label>
                                <input className="input-field" name='firstName' type='text' value={firstName} onChange={this.handleInputChange}/>
                            </div>
                            <div className='form-group'>
                                <label className="form-title">Last Name</label>
                                <input className="input-field" name='lastName' type='text' value={lastName} onChange={this.handleInputChange}/>
                            </div>                     
                        </div>
                        <div className='form-group'>
                            <label className="form-title">Email</label>
                            <div className='email-display'>
                                <input className="input-field" type='email' value={email} name="email" readOnly/>
                                <span className="edit-btn" onClick={this.handleEmailEditClick}><VscEdit/> Edit</span>
                            </div>
                        </div>                      
                        <div className='form-group'>
                            <label className="form-title">Phone</label>
                            <input className="input-field" type='text' value={phone} name="phone" onChange={this.handleInputChange}/>
                        </div>
                        <button className="save-btn" onClick={this.handleOnSave}>SAVE</button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfile));