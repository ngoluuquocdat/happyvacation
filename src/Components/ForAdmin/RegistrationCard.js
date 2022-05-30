import React, { Component } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from "react-loading";
import { BsClock, BsPeople, BsPen } from 'react-icons/bs';
import { BiCategoryAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import '../../Styles/ForAdmin/registration-card.scss'

class RegistrationCard extends Component {

    state = {
        openMore: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // approve registration
    approveRegistration = (registrationId) => {
        this.props.approveRegistration(registrationId)
    } 

    render() {
        const registration = this.props.registration;
        //const avatarUrl = `url('${tour.thumbnailPath}')`;
        return (           
            <div className='registration-card'>
                <div className='registration-info-item id'>{registration.id}</div>
                <div className='registration-info-item user-id'>{registration.userId}</div>
                <div className='registration-info-item provider-name'>{registration.providerName}</div>
                <div className='registration-info-item contact-person'>{registration.contactPersonName}</div>
                <div className='registration-info-item provider-email'>{registration.providerEmail}</div>
                <div className='registration-info-item provider-phone'>{registration.providerPhone}</div>
                <div className='registration-info-item date'>{registration.dateCreated}</div>

                <div className='registration-info-item action'>
                    {
                        !registration.isApproved &&
                        <>
                            <button className='btn approve' onClick={() => this.approveRegistration(registration.id)}>Approve</button>
                            <button className='btn reject'>Reject</button>
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

export default connect(mapStateToProps)(RegistrationCard);

  