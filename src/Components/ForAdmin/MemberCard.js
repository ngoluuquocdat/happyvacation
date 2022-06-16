import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { GiCheckMark } from 'react-icons/gi';
import '../../Styles/ForAdmin/member-card.scss'

class MemberCard extends Component {

    state = {
        openMore: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // enable - disable
    disableEnableMember = (userId) => {
        this.props.disableEnableMember(userId)
    }

    render() {
        const user = this.props.user;
        const avatarUrl = `url('${this.baseUrl + user.avatarUrl}')`;

        return (           
            <div className='member-card-wrapper'>
                <div className='member-info-item id'>{user.id}</div>
                <div className='member-info-item member-user-name'>
                    <div className='member-avatar' style={{backgroundImage: avatarUrl}}></div>
                    <span className='member-user-name-text'>{user.username}</span>
                </div>
                <div className='member-info-item first-name'>{user.firstName}</div>
                <div className='member-info-item last-name'>{user.lastName}</div>
                <div className='member-info-item phone'>{user.phone}</div>
                <div className='member-info-item email'>{user.email}</div>
                <div className='member-info-item enable'>{user.isEnabled ? "Enabled" : "Disabled"}</div>
                <div className='member-info-item action'>
                    <button className={ user.isEnabled ? 'btn-disable' : 'btn-enable'} 
                            onClick={() => this.disableEnableMember(user.id)}
                    >
                        {
                            user.isEnabled ? 
                            'Disable'
                            :
                            'Enable'
                        }
                    </button>                  
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

export default connect(mapStateToProps)(withRouter(MemberCard));

  