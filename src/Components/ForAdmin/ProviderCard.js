import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GiCheckMark } from 'react-icons/gi';
import '../../Styles/ForAdmin/provider-card.scss'

class ProviderCard extends Component {

    state = {
        openMore: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    render() {
        const provider = this.props.provider;
        const avatarUrl = `url('${this.baseUrl + provider.avatarUrl}')`;

        return (           
            <div className='provider-card-wrapper'>
                <div className='provider-info-item id'>{provider.id}</div>
                <div className='provider-info-item user-id'>{provider.userId}</div>
                <div className='provider-info-item provider-name'>
                    <div className='provider-thumbnail' style={{backgroundImage: avatarUrl}}></div>
                    <span className='provider-name-text'>{provider.providerName}</span>
                </div>
                <div className='provider-info-item date'>{provider.dateCreated}</div>
                <div className='provider-info-item rating'>{provider.averageRating}</div>
                <div className='provider-info-item enable'>{provider.isEnabled ? "Enabled" : "Disabled"}</div>
                <div className='provider-info-item action'>
                    <button className='btn-view'>View</button>                  
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

export default connect(mapStateToProps)(ProviderCard);

  