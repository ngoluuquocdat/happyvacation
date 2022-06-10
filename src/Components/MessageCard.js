import React, { Component } from 'react';
import "../Styles/message-card.scss";

class MessageCard extends Component {
    
    
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
                    style={{marginTop: topSpacing ? '8px' : '',
                            marginBottom: bottomSpacing ? '8px' : ''}}>
                    <p className="message__content">{message.content}</p>
               </div>
            </div>
        )
    }
}

export default MessageCard;