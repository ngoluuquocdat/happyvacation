import React, { Component } from 'react';
import MessageCard from '../../MessageCard';
import { BsFillPlusCircleFill, BsCardImage, BsFillStickyFill } from 'react-icons/bs';
import { RiFileGifFill } from 'react-icons/ri';
import { connect } from 'react-redux';
import "../../../Styles/ForProvider/provider-chat-box.scss";

class ChatBox extends Component {

    state = {
        message_content: ''
    }

    baseUrl = this.props.reduxData.baseUrl;

    // input message
    inputMessage = (e) => {
        this.setState({
            message_content: e.target.value
        })
    }
    
    // click send button
    sendMessage = () => {
        const message_content = this.state.message_content;
        if(message_content.trim().length > 0) {
            this.props.sendMessage(message_content);
            this.setState({
                message_content: ''
            })
        }
    }
    
    render() {
        const { userId, withUser, messages } = this.props
        const avatarUrl = `url('${this.baseUrl+withUser.avatarUrl}')`;
        const message_content = this.state.message_content;

        return (
            <div className="chat-box-wrapper">
                <div className="chat-box__header">
                    {/* <span>{userId}</span>
                    with
                    <span>{withUserId}</span> */}
                    <div className="user-info">
                        <div className="user-avatar" style={{backgroundImage: avatarUrl}}></div>
                        <span className="full-name">{withUser.fullName}</span>
                    </div>
                </div>
                <div className="chat-box__message-list">
                    {
                        messages.length > 0 ?
                        messages.slice().reverse().map((item, index) => {
                            return (
                                <MessageCard 
                                    key={index} 
                                    userId={userId} 
                                    withUserId={withUser.id} 
                                    message={item}
                                    wide={true}
                                />
                            )
                        })
                        :
                        <span>Nothing here yet! Say something!</span>
                    }
                </div>
                <div className="new-message-input">
                    <div className="input-controls">
                        <BsFillPlusCircleFill className='icon'/>
                        <BsCardImage className='icon'/>
                        <BsFillStickyFill className='icon'/>
                        <RiFileGifFill className='icon'/>
                    </div>
                    <input 
                        className='input-field' 
                        placeholder='Your message...'
                        value={message_content}
                        onChange={this.inputMessage}
                    />
                    <button className='send-btn' onClick={this.sendMessage}>Send</button>
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

export default connect(mapStateToProps)(ChatBox);