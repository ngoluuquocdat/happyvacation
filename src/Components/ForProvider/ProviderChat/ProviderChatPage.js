import React, { Component } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import HeaderNav from '../../Header/HeaderNav';
import ChatUserCard from './ChatUserCard';
import ChatBox from './ChatBox';
import "../../../Styles/ForProvider/provider-chat-page.scss";

class ProviderChatPage extends Component {

    state = {
        withUser: {},
        current_user_id: '',
        list_users: [],
        messages: [],
        connection: null,
        pickingUserId: '',
        unseenSenderIds: [],
        userTyping: {
            id: 0,
            isTyping: false
        },
        isProviderEnabled: true,
        isLoadingMessage: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        console.log('run did mount');
        // call api get list chat users
        const list_users = await this.getChatUsers();
        this.setState({
            list_users: list_users,
            withUser: (list_users && list_users.length > 0) ? list_users[0] : { id:0 }
        });
        // check current user enable
        let isProviderEnabled = await this.checkProviderEnabled();         
        this.setState({
            isProviderEnabled: isProviderEnabled
        });          
    }

    async componentDidUpdate(prevProps, prevState) {       
        // connect signal r again if current_user change
        if(prevProps.reduxData.user !== this.props.reduxData.user) {
            // redirect to login when user log out
            if(this.props.reduxData.user === null) {
                console.log('user log out')
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                return;
            }
            this.setState({
                current_user_id: `provider${this.props.reduxData.user.providerId}`
            })
            await this.connectToChatHub();
            // check current user enable
            let isProviderEnabled = await this.checkProviderEnabled();         
            this.setState({
                isProviderEnabled: isProviderEnabled
            });  
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

    getChatUsers = async () => {
        const token = localStorage.getItem('user-token');
        
        if(!token) {
            this.props.history.push('/login');
            return [];
        }
        try {
            let res = await axios.get(
                `${this.baseUrl}/api/Messages/me/chat-users`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );    
            return res.data  
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
                this.setState({
                    isLoadingMessage: true
                })
                const withUserId = this.state.withUser.id;
                let res = await axios.get(
                    `${this.baseUrl}/api/Messages/for-providers?withUserId=${withUserId}`,
                    {
                        headers: { Authorization:`Bearer ${token}` }
                    }
                );  
                this.setState({
                    messages: res.data
                })      
    
            } catch(e) {
                console.log(e)
            } finally {
                this.setState({
                    isLoadingMessage: false
                })
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

    // check provider enable
    checkProviderEnabled = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        try {            
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/check-enabled`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );                     
            return res.data.isEnabled;        
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
            }         
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
            if (error.response.status === 403) {
                console.log(error)
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                toast.info("Only tour provider can visit the page.")
            }
        }
    }

    // ket noi signal R
    connectToChatHub = async () => {
        let current_user_id = `provider${this.props.reduxData.user.providerId}`;   // format: provider1
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
                //console.log(`current: ${this.state.current_user.id}, sender: ${message.senderId}`)
                //console.log('current != sender ?', this.state.current_user.id !== message.senderId)

                // update list chat users logic
                let list_users = [];
                if(this.state.list_users.length > 0) {
                    list_users=[...this.state.list_users];
                    if((this.state.current_user_id !== message.senderId) && (!this.state.list_users.find(e => e.id === message.senderId))) {
                        // console.log(`current: ${this.state.current_user.id}, sender: ${message.senderId}`);
                        // console.log('sender not in list ?', !this.state.list_users.find(e => e.id === message.senderId));
                        console.log('reload list users');
                        list_users = await this.getChatUsers();
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
                // let list_users = this.state.list_users;
                if(list_users.length > 0) {
                    if(this.state.current_user_id !== message.senderId) {
                        const foundIndex = list_users.findIndex(el => el.id === message.senderId);
                        const latestUser = list_users.splice(foundIndex, 1)[0];
                        list_users.unshift(latestUser);
                    }
                }

                this.setState({
                    list_users: list_users,
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

    // delete anonymous conversation
    deleteAnonymousConversation = async(deleteUserId) => {
        const token = localStorage.getItem('user-token');
        if(!token) {     
            this.props.history.push('/login');
            return;
        }
        // delete messages in database
        try {
            let res = await axios.delete(
                `${this.baseUrl}/api/Messages/me/conversation?withUserId=${deleteUserId}`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  
            this.setState({
                list_users: this.state.list_users.filter(el => el.id !== deleteUserId)
            })      
        } catch(e) {
            console.log(e)
            if(e.response.status === 401) {
                this.props.history.push('/');   
            }
        }
    }
    
    render() {
        const { current_user_id, withUser, list_users, messages, userTyping, isProviderEnabled } = this.state;
        const { unseenSenderIds } = this.state;
        const isLoadingMessage = this.state.isLoadingMessage;

        return (
            <div className="provider-chat-page-wrapper">
                <div className="small-header">
                    <HeaderNav />
                </div>
                <div className="provider-chat-page-container">
                    <div className="provider-chat-page__left">
                        <div className="user-list">
                            {
                                list_users.map((item, index) => {
                                    return(
                                        <ChatUserCard 
                                            key={'user-card'+item.id} 
                                            user={item} 
                                            userCardClick={this.userCardClick} 
                                            highlight={unseenSenderIds.includes(item.id)}
                                            deleteAnonymousConversation={this.deleteAnonymousConversation}
                                            isChattingWith={item.id === withUser.id}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="provider-chat-page__right">
                        {
                            isLoadingMessage ?
                            <div className="loading-container">
                                <ReactLoading
                                    className="loading-component"
                                    type={"spin"}
                                    color={"#df385f"}
                                    height={40}
                                    width={40}
                                />
                            </div>
                            :
                            <>
                                {
                                    withUser.id !== 0 &&
                                    <ChatBox 
                                        userId={current_user_id} 
                                        withUser={withUser} 
                                        messages={messages} 
                                        sendMessage={this.sendMessage}
                                        userTyping={userTyping}
                                        changeTypingState={this.changeTypingState}
                                        isProviderChat={true}
                                        isProviderEnabled={isProviderEnabled}
                                    />
                                }   
                            </>
                            
                        }
                    </div>
                </div>
            </div>
        )
    }
}

// const list_users = [
//     {
//         id: 1,
//         avatarUrl: 'https://res.cloudinary.com/quocdatcloudinary/image/upload/v1652243520/samples/people/jazz.jpg',
//         fullName: 'Ngo Luu Quoc Dat',

//     },
//     {
//         id: 2,
//         avatarUrl: 'https://res.cloudinary.com/quocdatcloudinary/image/upload/v1652243520/samples/people/jazz.jpg',
//         fullName: 'Dinh Cong Tai',
        
//     }
// ]

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(ProviderChatPage));