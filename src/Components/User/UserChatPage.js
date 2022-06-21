import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { withRouter } from "react-router-dom";
import HeaderNav from '../Header/HeaderNav';
import ChatUserCard from '../ForProvider/ProviderChat/ChatUserCard';
import ChatBox from '../ForProvider/ProviderChat/ChatBox';
import "../../Styles/ForProvider/provider-chat-page.scss";

class UserChatPage extends Component {

    state = {
        withUser: {
            id: 0
        },
        current_user_id: '',
        list_providers: [],
        messages: [],
        connection: null,
        pickingUserId: '',
        unseenSenderIds: [],
        userTyping: {
            id: 0,
            isTyping: false
        }
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        // call api get list chat users
        const list_providers = await this.getChatProviders();
        this.setState({
            list_providers: list_providers,
            withUser: (list_providers && list_providers.length > 0) ? list_providers[0] : { id:0 }
        })          
    }

    async componentDidUpdate(prevProps, prevState) {       
        // connect signal r again if current_user change
        if(prevProps.reduxData.user !== this.props.reduxData.user) {
            // redirect to login when user log out
            if(this.props.reduxData.user === null) {
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                return;
            }
            this.setState({
                current_user_id: `${this.props.reduxData.user.id}`
            })
            await this.connectToChatHub();
        }
        // get list messages
        if(prevState.withUser !== this.state.withUser) {
            await this.getMessages();
        }
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

    getChatProviders = async () => {
        const token = localStorage.getItem('user-token');        
        if(!token) {
            this.props.history.push('/login');
            return [];
        }
        try {
            let res = await axios.get(
                `${this.baseUrl}/api/Messages/me/chat-providers`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );    
            return res.data;  
        } catch(e) {
            console.log(e)
        }
    }

    getMessages = async () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        } else {
            try {
                const withUserId = this.state.withUser.id;
                let res = await axios.get(
                    `${this.baseUrl}/api/Messages?withUserId=${withUserId}`,
                    {
                        headers: { Authorization:`Bearer ${token}` }
                    }
                );  
                this.setState({
                    messages: res.data
                })      
    
            } catch(e) {
                console.log(e)
            }
        }
    }

    sendMessage = async (message_content, image_url) => {
        const connection = this.state.connection;
        const messageDto = {
            senderId: this.state.current_user_id.toString(),
            receiverId: this.state.withUser.id.toString(),
            content: message_content,
            imageUrl: image_url
        }
        //console.log('message dto to send', messageDto);
        try {
            // invoke SendMessage method in the server
            await connection.invoke("SendMessage", messageDto);
        } catch(e) {
            console.log(e);
        }
    }   

    changeTypingState = async (isTyping) => {
        const connection = this.state.connection;
        if(connection) {
            const senderId = this.state.current_user_id.toString();
            const receiverId = this.state.withUser.id.toString();
            try {
                await connection.invoke("ChangeTypingState", isTyping, senderId, receiverId);
            } catch(e) {
                console.log(e);
            }
        }
    }

    // ket noi signal R
    connectToChatHub = async () => {
        let current_user_id = `${this.props.reduxData.user.id}`;
        console.log('current user id', current_user_id)

        try {
            const connection = new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chat`)
            .configureLogging(LogLevel.Information)
            .build();
    
            // method to receive message from our server
            connection.on("ShakeHandMessage", (message) => {
                console.log('Shake hand message:', message);
            });

            // method to receive message from our server
            connection.on("ReceiveMessage", async (message) => {
                console.log('message received:', message);

                // update list chat users logic
                let list_providers = [];
                if(this.state.list_providers.length > 0) {
                    list_providers=[...this.state.list_providers];
                    if((this.state.current_user_id !== message.senderId) && (!this.state.list_providers.find(e => e.id === message.senderId))) {
                        list_providers = await this.getChatProviders();
                    }
                }
                // update messages list logic
                let messages = this.state.messages;
                let unseenSenderIds = this.state.unseenSenderIds;
                if(message.senderId === this.state.withUser.id || message.senderId === this.state.current_user_id) {
                    messages = [...messages, message]
                    console.log('update list messages')
                }
                // update list unseen logic
                if(message.senderId !== this.state.withUser.id && message.senderId !== this.state.current_user_id) {
                    unseenSenderIds = [...unseenSenderIds, message.senderId];
                }
                // move latest unseen user to top
                if(list_providers.length > 0) {
                    if(this.state.current_user_id !== message.senderId) {
                        const foundIndex = list_providers.findIndex(el => el.id === message.senderId);
                        const latestUser = list_providers.splice(foundIndex, 1)[0];
                        list_providers.unshift(latestUser);
                    }
                }

                this.setState({
                    list_providers: list_providers,
                    messages: messages,
                    unseenSenderIds: unseenSenderIds
                })
            });

            connection.on("ChangeTypingState", (message) => {
                console.log('typing received:', message);
                this.setState({
                    userTyping: {
                        id: message.senderId,
                        isTyping: message.isTyping
                    }
                })
            });
               
            await connection.start();
            await connection.invoke("ConnectUserToChatHub", current_user_id.toString());
            this.setState({
                connection: connection
            })
        } catch(e) {
            console.log(e);
        }
    }

    // handle user card click
    userCardClick = (withUser) => {
        this.setState({
            withUser: withUser,
            unseenSenderIds: this.state.unseenSenderIds.filter((item) => item !== withUser.id)
        })
    }
    
    render() {
        const { current_user_id, withUser, list_providers, messages, userTyping } = this.state;
        const { unseenSenderIds } = this.state;

        return (
            <div className="provider-chat-page-wrapper">
                <div className="small-header">
                    <HeaderNav />
                </div>
                <div className="provider-chat-page-container">
                    <div className="provider-chat-page__left">
                        <div className="user-list">
                            {
                                list_providers.map((item, index) => {
                                    return(
                                        <ChatUserCard 
                                            key={'user-card'+item.id} 
                                            user={item} 
                                            userCardClick={this.userCardClick} 
                                            highlight={unseenSenderIds.includes(item.id)}
                                            deleteAnonymousConversation={false}
                                            isChattingWith={item.id === withUser.id}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="provider-chat-page__right">
                        {
                            withUser.id !== 0 &&
                            <ChatBox 
                                userId={current_user_id}
                                withUser={withUser}
                                messages={messages}
                                sendMessage={this.sendMessage}
                                userTyping={userTyping}
                                changeTypingState={this.changeTypingState}
                            />
                        }
                    </div>
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

export default connect(mapStateToProps)(withRouter(UserChatPage));