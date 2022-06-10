import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../../../Styles/ForProvider/chat-user-card.scss";

class ChatUserCard extends Component {

    baseUrl = this.props.reduxData.baseUrl;
    
    userCardClick = () => {
        //const userId = this.props.user.id;
        this.props.userCardClick(this.props.user)
    }

    deleteAnonymousConversation = (event, deleteUserId) => {
        event.stopPropagation();
        this.props.deleteAnonymousConversation(deleteUserId)
    }
    
    render() {
        const user = this.props.user;
        const isChattingWith = this.props.isChattingWith;
        const avatarUrl = `url('${this.baseUrl+user.avatarUrl}')`;
        const highlight = this.props.highlight;

        return (
            <div className="user-card-wrapper" onClick={this.userCardClick}>
                <div className="user-card__left">
                    <div className="user-avatar" style={{backgroundImage: avatarUrl}}></div>
                </div>
                <div className="user-card__right">
                    <h3 className={highlight ? "full-name--bold" : "full-name"}>{user.fullName}</h3>
                    <p className="latest-message">{user.latestMessage}</p>
                    {
                        user.isConversationDeletable && !isChattingWith &&
                        <button className='btn-delete' onClick={(event) => this.deleteAnonymousConversation(event, user.id)}>DELETE</button>
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

export default connect(mapStateToProps)(ChatUserCard);