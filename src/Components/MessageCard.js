import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../Styles/message-card.scss";

class MessageCard extends Component {
    
    baseUrl = this.props.reduxData.baseUrl;
    
    render() {
        const { userId, withUserId, topSpacing, bottomSpacing, wide } = this.props;
        const message = this.props.message;

        return (
            <div className="message-card-wrapper">
               <div 
                    className={
                        (message.senderId == userId ? "message-card--right" : "message-card--left")
                        + " " +
                        (wide ? "wide" : "")
                    }
                    style={{marginTop: topSpacing ? '10px' : '',
                            marginBottom: bottomSpacing ? '10px' : ''}}>
                    {
                        message.content.length > 0 &&
                        <p className="message__content">{message.content}</p>
                    }
                    {
                        message.imageUrl.length > 0 &&
                        <img className='message__image' src={this.baseUrl+message.imageUrl} onClick={() => window.open(this.baseUrl+message.imageUrl, '_blank')}/>
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

export default connect(mapStateToProps)(MessageCard);