import React from 'react'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Pagination } from "@mui/material";
import RegistrationCard from './RegistrationCard';
import '../../Styles/ForAdmin/registrations-page.scss'

class RegistrationsPage extends React.Component {

    state = {
        registrations: [],
        totalPage: 2,
        totalCount: 0,
        page: 1,
        perPage: 3,
        registrationId: '',
        providerName: '',
        contactor: '',
        isLoading: false
    }

    listPlaces = [];
    categories =  [];
    baseUrl = this.props.reduxData.baseUrl;

    async getRegistrations(token, registrationId, providerName, contactPersonName, page, perPage) {
        try {          
            this.setState({
                isLoading: true,
            });            
            var params = new URLSearchParams();
            params.append("registrationId", registrationId);
            params.append("providerName", providerName);
            params.append("contactPersonName", contactPersonName);
            // params.append("providerEmail", providerEmail);
            // params.append("providerPhone", providerPhone);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(
                `${this.baseUrl}/api/Providers/registrations`,
                {
                    headers: { Authorization:`Bearer ${token}` },
                    params: params,
                }
            );
            // console.log(res);            
            // set state
            this.setState({
                totalPage: res.data.totalPage,
                totalCount: res.data.totalCount,
                registrations: res.data.items                
            })
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
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    async componentDidMount() {
        // check jwt token
        const token = localStorage.getItem('user-token');
        // if(!token) {
        //     this.props.history.push('/admin/login', {prevPath: this.props.location.pathname});
        // }
        
        // call api to get registrations
        let { registrationId, providerName, contactor, page, perPage } = this.state;
        registrationId = registrationId !== '' ? registrationId : 0;
        this.getRegistrations(token, registrationId, providerName, contactor, page, perPage)
    }

    async componentDidUpdate(prevProps, prevState) {
        
    } 

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    // handle input change
    inputChange = (event) => {
        const key = event.target.name;
        this.setState({
            [key]: event.target.value
        })
    }

    // approve registration
    approveRegistration = async(registrationId) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login', {prevPath: this.props.location.pathname});
        }
        try {
            let res = await axios.put(
                `${this.baseUrl}/api/Providers/registrations/${registrationId}/approve`,
                {},
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  

            // set state with updated order
            const index = this.state.registrations.findIndex((element) => element.id === res.data.id);
            let registrations = this.state.registrations;
            registrations[index] = res.data
            this.setState({
                registrations: registrations
            })     
            // show toast notify
            toast.success("Approved successfully!");
        } catch (error) {
            if (!error.response) {
                console.log(error)
                toast.error("Network error");
                return;
            }
            if (error.response.status === 401) {
                toast.error("Login to continue");
                console.log(error)
                this.props.history.push('/admin/login', {prevPath: this.props.location.pathname});
            }
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                this.props.history.push('/admin/login', {prevPath: this.props.location.pathname});
            }
        }
    }

    // handle search tour click
    searchRegistration = () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        let { registrationId, providerName, contactor, page, perPage } = this.state;
        registrationId = registrationId !== '' ? registrationId : 0;
        this.getRegistrations(token, registrationId, providerName, contactor, page, perPage)
    }

    // handle reset search tour
    resetSearch = () => {
        this.setState({
            registrationId: '',
            providerName: '',
            contactor: ''
        })
    }


    render() {
        const { registrations, page, totalPage, totalCount, isLoading } = this.state;
        const { registrationId, providerName, contactor } = this.state;

        return (
            <div className='registrations-page-container'>
                <div className='registrations-page-header'>
                    <div className='title'>Tour provider registrations</div>
                    <div className='sub-title'>See and approve or reject tour provider registration</div>
                </div>
                <div className='search-area'>
                    <div className='search-area-upper'>
                        <div className='search-group'>
                            <span className='search-label'>Registration ID: </span>
                            <input className='search-input' name='registrationId' placeholder='Type here' value={registrationId} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Provider Name: </span>
                            <input className='search-input name' name='providerName' placeholder='Type here' value={providerName} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Contact Person Name: </span>
                            <input className='search-input name' name='contactor' placeholder='Type here' value={contactor} onChange={this.inputChange}/>
                        </div>
                        {/* <div className='search-group'>
                            <span className='search-label'>Provider Phone: </span>
                            <input className='search-input name' name='tourName' placeholder='Type here' value={tourName} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Provider Email: </span>
                            <input className='search-input name' name='tourName' placeholder='Type here' value={tourName} onChange={this.inputChange}/>
                        </div> */}
                    </div>

                    <div className='button-area'>
                        <button className='btn-search' onClick={this.searchRegistration}>Search</button>
                        <button className='btn-reset' onClick={this.resetSearch}>Reset</button>
                    </div>
                </div>
                <div className='registrations-page-body'>
                    <div className='list-registrations-wrap'>
                        <div className='registration-number'>
                            {
                                isLoading ? ' ' : (totalCount > 1 ? `${totalCount} Registrations` : `${totalCount} Registration`)
                            }                       
                        </div>
                        <div className='list-registrations'>
                            <div className='list-registrations-header'>
                                <div className='list-registrations-header-item id'>ID</div>
                                <div className='list-registrations-header-item user-id'>Member ID</div>
                                <div className='list-registrations-header-item provider-name'>Provider Name</div>
                                <div className='list-registrations-header-item contact-person'>Contactor</div>
                                <div className='list-registrations-header-item provider-email'>Email</div>
                                <div className='list-registrations-header-item provider-phone'>Phone</div>
                                <div className='list-registrations-header-item date'>Date</div>
                                <div className='list-registrations-header-item action'>Action</div>
                            </div>
                            <div className='list-tour-content'>
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
                                {
                                    registrations.map((item) => {
                                        return (
                                            <RegistrationCard key={'regis'+item.id} registration={item} approveRegistration={this.approveRegistration}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {totalPage > 1 && (
                    <div className="pagination-container">
                        <Pagination
                            count={totalPage}
                            shape="rounded"
                            siblingCount={1}
                            page={page}
                            onChange={(event, page) =>
                                this.handleOnChangePage(event, page)
                            }
                        />
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(RegistrationsPage));