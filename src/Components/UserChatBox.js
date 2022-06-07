import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { IoIosSend } from 'react-icons/io';
import '../Styles/user-chat-box.scss';

class UserChatBox extends React.Component {

    state = {
        messages: [],
        message_content: '',
        current_user_id: this.props.reduxData.user ? this.props.reduxData.user.id.toString() : localStorage.getItem('anonymous-guid'),
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        console.log('did mount, create a connection to chat hub');
        // connect user to chat hub
        await this.connectToChatHub();
    }

    async componentWillUnmount() {
        // close current connection before un mount
        const connection = this.state.connection;      
        if(connection) {
            try {              
                await connection.stop();
            } catch(e) {
                console.log(e)
            }
        }
    }

    handleMessageInput = (e) => {
        this.setState({
            message_content: e.target.value
        })
    }

    // ket noi signal R
    connectToChatHub = async () => {
        console.log("connect to chat hub")
        let current_user_id = this.state.current_user_id ? this.state.current_user_id : '';
        console.log('cur user id', current_user_id)
        const connection = this.state.connection;
        
        if(connection) {
            console.log("connection exist")
            return;
        }

        try {
            const connection = new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chat`)
            .configureLogging(LogLevel.Information)
            .build();

            // method to receive message from our server
            connection.on("ShakeHandMessage", (message) => {
            console.log('message received:', message);
            if(current_user_id === '') {
                // current_user_id == 0 means anonymous mode, so message is guid, save the guid to current user id
                localStorage.setItem('anonymous-guid', message)
                this.setState({
                    current_user: {
                        id: message
                    }
                })
            }
            });
            // method to receive message from our server
            connection.on("ReceiveMessage", async (message) => {
                console.log('message received 2:', message);
                //console.log(`current: ${this.state.current_user.id}, sender: ${message.senderId}`)
                //console.log('current != sender ?', this.state.current_user.id !== message.senderId)          
                // update messages list logic
                let messages = this.state.messages;
                if(message.senderId === this.props.providerId.toString() || message.senderId === this.state.current_user_id) {
                    messages = [...messages, message]
                    console.log('update list messages')
                }
                // update state
                this.setState({
                    messages: messages
                })
            });

            // connection stop handler
            connection.onclose(e => {
            //setConnection();
            //setMessages([]);
            });

            await connection.start();
            //console.log('started connection')
            await connection.invoke("ConnectUserToChatHub", current_user_id.toString());
            //console.log('invoked connect')
            this.setState({
                connection: connection
            })
        } catch(e) {
          console.log(e);
        }
    }

    // send message function
    sendMessage = async (message_content) => {
        const connection = this.state.connection;
        const messageDto = {
            senderId: this.state.current_user_id.toString(),
            receiverId: this.props.providerId.toString(),
            content: message_content
        }
        //console.log('message dto to send', messageDto);
        try {
            // invoke SendMessage method in the server
            await connection.invoke("SendMessage", messageDto);
        } catch(e) {
            console.log(e);
        }
    }

    // handle click send button
    handleSendClick = async () => {
        const message_content = this.state.message_content;
        if(message_content.trim().length > 0) {
            this.setState({
                message_content: ''
            })
            await this.sendMessage(message_content);
        }
    }

    render() {
        const messages = this.state.messages;
        const { providerId, providerName, providerAvatar, closeChatBox } = this.props;
        const { message_content } = this.state;

        return (
            <div className='user-chat-box-wrapper'>
                <div className='user-chat-box-header'>
                    <div className='provider-avatar' style={{backgroundImage: `url('${this.baseUrl+providerAvatar}')`}}></div>
                    <span className='provider-name'>{providerName}</span>
                    <span className='close-chat-box-btn' onClick={() => closeChatBox()}>X</span>
                </div>
                <div className='message-list'>

                </div>
                <div className='message-input-section'>
                    <textarea className='message-input' onChange={this.handleMessageInput} value={message_content}/>
                    <button className='send-btn' onClick={this.handleSendClick}><IoIosSend/></button>
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

export default connect(mapStateToProps)(withRouter(UserChatBox));