import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GiCheckMark } from 'react-icons/gi';
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
                        registration.isApproved ?
                        <GiCheckMark />
                        :
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

  