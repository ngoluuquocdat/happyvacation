import React from 'react';
import PlacePicker from '../PlacePicker';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { VscEdit } from 'react-icons/vsc'
import { IoIosReturnLeft } from 'react-icons/io'
import '../../Styles/ForProvider/provider-profile.scss'

class InformationPage extends React.Component {

    state = {
        name: '',
        phone: '',
        email: '',
        description: '',
        avatarUrl: '',
        address: '',
        newPlace: '',
        newAddress: '',
        newUrl: '',
        file: null,
        openAddressField: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }



    async componentDidMount() {
        // call api to get providers     
        // check token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }

        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );         
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
            if (error.response.status === 403) {
                console.log(error);
                // redirect to provider register page or show notification
                this.props.history.push('/for-provider/register');
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 1500) 
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

    // toggle address input
    handleAddressEditClick = () => {
        const openAddressField = this.state.openAddressField;
        this.setState({
            openAddressField: !openAddressField,
            newAddress: '',
            newPlace: '',
        })
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
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }

        // add check image file, if not null => there's new image file => include that image file to request
        const {newAddress, newPlace} = this.state;
        const isNewAdressExist = (newAddress!=='' && newPlace!=='') || (newAddress==='' && newPlace==='');
        if(isNewAdressExist === false) {
            toast.warning('Please fill all information!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
            });
            return;
        }

        let data = new FormData();
        data.append('name', this.state.name);
        data.append('description', this.state.description);
        data.append('phone', this.state.phone); 
        data.append('email', this.state.email); 
        data.append('address', (newAddress==='' && newPlace==='') ? this.state.address : `${this.removeVietnameseTones(newAddress)}, ${newPlace}`); 
        if(this.state.file != null) {
            data.append('avatar', this.state.file)
        }      

        // post to api
        try {
            let res = await axios.put(
                `${this.baseUrl}/api/Providers/me`,
                data,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  

            // set state with updated provider profile
            this.setState({
                ...res.data,
                openAddressField: false,
                file: null,
                newUrl: ''
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
                // redirect to provider register page or show notification
                this.props.history.push('/for-provider/register');
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }  
    }

    render() {
        const newUrl = this.state.newUrl;
        const { name, phone, email, address, description, avatarUrl} = this.state;
        const avatarUrl_real = newUrl.length === 0 ? `url('${this.baseUrl+avatarUrl}')` : `url('${newUrl}')`;
        const { openAddressField, newAddress } = this.state;
        return (
            <div className='profile-page-container'>
                <div className='profile-header'>
                    <div className='title'>Company Profile</div>
                    <div className='sub-title'>View and update your Company profile</div>
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
                        <div className='form-group'>
                            <label className="form-title company-name">Company name</label>
                            <input className="input-field company-name" name='name' type='text' value={name} onChange={this.handleInputChange}/>
                        </div>
                        <div className='form-group'>
                            <label className="form-title">Description</label>
                            <textarea className="input-area" name='description' value={description} onChange={this.handleInputChange}/>
                        </div>
                        <div className='form-group'>
                            <label className="form-title">Address</label>
                            {
                                openAddressField ?
                                <div className="address-change">
                                    <PlacePicker onPlacePick={this.onPlacePick}/>
                                    <input 
                                        className="input-field" 
                                        type='text' 
                                        placeholder="Detailed number and street..."
                                        value={newAddress}
                                        name='newAddress'
                                        onChange={this.handleInputChange}
                                    />
                                    <span className="back-btn" onClick={this.handleAddressEditClick}><IoIosReturnLeft/> Back</span>
                                </div>
                                :
                                <div className='address-display'>
                                    <input className="input-field address" type='text' value={address} readOnly/>
                                    <span className="edit-btn" onClick={this.handleAddressEditClick}><VscEdit/> Edit</span>
                                </div>
                            }
                        </div>
                        <div className='form-group'>
                            <label className="form-title">Email</label>
                            <input className="input-field" type='email' value={email} name="email" onChange={this.handleInputChange}/>
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
    id: 1,
    name: 'Hoi An Express',
    phone: '0905123456',
    email: 'info@hoianexpress.com.vn',
    address: '32 Tien Giang St, Tan Binh District, Ho Chi Minh City, Viet Nam',
    dateCreated: '28/03/2022',
    averageRating: 4.4,
    tourAvailable: 180,
    description: 'Established in 2002, Hoi An Express is a company specializing in organizing professional tours for foreign visitors to Vietnam to visit tours, conferences, events combined with team building.',
    avatarUrl: 'https://pbs.twimg.com/profile_images/721952678016737280/ppDehV3R_400x400.jpg'
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(InformationPage));