import React from 'react';
import axios from 'axios';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { IoIosSend } from 'react-icons/io';
import { BsCardImage } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ReactLoading from "react-loading";
import MessageCard from './MessageCard';
import '../Styles/user-chat-box.scss';

class UserChatBox extends React.Component {

    state = {
        messages: [],
        message_content: '',
        image: { url: '', file: null },
        current_user_id: this.props.reduxData.user ? this.props.reduxData.user.id.toString() : localStorage.getItem('chat-guid'),
        userTyping: {
            id: 0,
            isTyping: false
        },
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        this.setState({
            isLoading: true
        });
        // connect user to chat hub
        await this.connectToChatHub();
        // get list messages
        await this.getMessages();
        this.setState({
            isLoading: false
        });
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
        if(e.target.value.length === 0) {
            this.changeTypingState(false);
        } else {
            const message__content = this.state.message_content;
            if(message__content.length === 0) {
                this.changeTypingState(true);
            }
        }
        this.setState({
            message_content: e.target.value
        })
    }

    // on image change
    onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const imageFile = event.target.files[0];
            // file extension check
            if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                console.log("image extension invalid");
                return false;
            }
            // image file content check
            // file reader for image validation 
            let fileReader = new FileReader();
            fileReader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    let image = this.state.image;
                    image.url = URL.createObjectURL(imageFile);
                    image.file = imageFile;
                    this.setState({
                        image: image
                    });
                };
                img.onerror = () => {
                    console.log("image content invalid");
                    return false;
                };
                img.src = e.target.result;
            };
            fileReader.readAsDataURL(imageFile); 
            // reset input 
            event.target.value = null;         
        }
    }

    // remove image
    handleRemoveImageClick = () => {
        this.setState({
            image: { url: '', file: null }
        })
    } 

    // get messages 
    getMessages = async () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            try {
                const current_user_id = this.state.current_user_id;
                const withUserId = `provider${this.props.providerId}`;
                let res = await axios.get(
                    `${this.baseUrl}/api/Messages/for-guests?userId=${current_user_id}&withUserId=${withUserId}`
                );  
                this.setState({
                    messages: res.data
                })      
            } catch(e) {
                console.log(e)
            }
        } else {
            try {              
                const withUserId = `provider${this.props.providerId}`;
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

    // change typing state
    changeTypingState = async (isTyping) => {
        const connection = this.state.connection;
        if(connection) {
            const senderId = this.state.current_user_id.toString();
            const receiverId = `provider${this.props.providerId}`;
            try {
                await connection.invoke("ChangeTypingState", isTyping, senderId, receiverId);
            } catch(e) {
                console.log(e);
            }
        }
    }

    // ket noi signal R
    connectToChatHub = async () => {
        console.log("connect to chat hub")
        let current_user_id = this.state.current_user_id ? this.state.current_user_id : 'ANONYMOUS';
        console.log('current user id', current_user_id);

        const connection = this.state.connection;  
        console.log('current connection', connection)   
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
                console.log('Shake hand message:', message);
                if(current_user_id === 'ANONYMOUS') {
                    // current_user_id == 0 means anonymous mode, so message has a guid, save the guid to current user id
                    if(message.chatGuid && message.chatGuid !== '') {
                        localStorage.setItem('chat-guid', message.chatGuid)
                        this.setState({
                            current_user_id: message.chatGuid
                        })
                    }
                }
            });
            // method to receive message from our server
            connection.on("ReceiveMessage", async (message) => {
                console.log('message received:', message);
                //console.log(`current: ${this.state.current_user.id}, sender: ${message.senderId}`)
                //console.log('current != sender ?', this.state.current_user.id !== message.senderId)          
                // update messages list logic
                let messages = this.state.messages;
                if(message.senderId === `provider${this.props.providerId}` || message.senderId === this.state.current_user_id) {
                    messages = [...messages, message]
                    console.log('update list messages')
                }
                // update state
                this.setState({
                    messages: messages
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
    sendMessage = async (message_content, image_url) => {
        const connection = this.state.connection;
        const messageDto = {
            senderId: this.state.current_user_id.toString(),
            receiverId: `provider${this.props.providerId.toString()}`,
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

    // handle click send button
    handleSendClick = async () => {
        if(!this.state.current_user_id && !localStorage.getItem('chat-guid')) {
            // if chat-guid removed 
            // stop current connection 
            console.log('reconnect due to lost chat-guid');
            await this.state.connection.stop();
            // create a new connection
            await this.connectToChatHub();
            // get list messages
            await this.getMessages();
            return;
        }
        // send message
        const message_content = this.state.message_content;
        let image_url = '';
        const image = this.state.image;
        if(message_content.trim().length > 0 || image.file !== null) {
            if(image.file !== null) {
                // upload file to my server
                const formData = new FormData();
                formData.append("image", image.file);
                let res = await axios.post(
                    `${this.baseUrl}/api/Messages/images`,
                    formData
                );   
                image_url = res.data.imageUrl;
            }
            await this.sendMessage(message_content, image_url);
            this.setState({
                message_content: '',
                image: { url: '', file: null }
            })
        }
    }

    // handle focus and blur event from message input
    handleFocusBlurMessage = (isTyping) => {
        const message__content = this.state.message_content;
        if(isTyping === true && message__content.length === 0) {
            return;
        }
        if(isTyping === false && message__content.length === 0) {
            return;
        }
        this.changeTypingState(isTyping);
    }

    render() {
        const messages = this.state.messages;
        const isLoading = this.state.isLoading;
        const { providerName, providerAvatar, closeChatBox } = this.props;
        const { current_user_id, userTyping } = this.state;
        const providerId = `provider${this.props.providerId}`;  // format: provider1
        const { message_content, image } = this.state;

        const showTypingEffect = (userTyping.isTyping === true) && (providerId === userTyping.id);

        return (
            <div className='user-chat-box-wrapper'>
                <div className='user-chat-box-header'>
                    <div className='provider-avatar' style={{backgroundImage: `url('${this.baseUrl+providerAvatar}')`}}></div>
                    <span className='provider-name'>{providerName}</span>
                    <span className='close-chat-box-btn' onClick={() => closeChatBox()}>X</span>
                </div>
                {
                    isLoading ?
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
                    <div className='message-list'>
                    {
                        showTypingEffect && 
                        <div className="typing-effect">
                            Typing
                            <ReactLoading
                                className="loading-component"
                                type={"bubbles"}
                                color={"#000"}
                                height={30}
                                width={40}
                                delay={5}
                                />
                        </div>
                    }
                    {
                        messages.length > 0 ?
                        messages.slice().reverse().map((item, index, array) => {
                            return (
                                <MessageCard 
                                    key={index} 
                                    userId={current_user_id}
                                    withUserId={providerId} 
                                    message={item}
                                    topSpacing={array[index+1] ? array[index+1].senderId !== item.senderId : false}
                                    bottomSpacing={array[index-1] ? array[index-1].senderId !== item.senderId : false}
                                />
                            )
                        })
                        :
                        <span style={{marginBottom: '10px'}}>Nothing here yet! Say something!</span>
                    }
                    </div>
                }
                <div className='message-input-section'>
                    <label className='control-label' htmlFor='input-image'>
                        <BsCardImage className='icon' />
                    </label>
                    <textarea 
                        className='message-input' 
                        value={message_content}
                        onChange={this.handleMessageInput} 
                        onFocus={() => this.handleFocusBlurMessage(true)}
                        onBlur={() => this.handleFocusBlurMessage(false)}
                    />
                    <input
                        className='input-image'
                        id='input-image'
                        type='file'
                        onChange={(event)=>this.onImageChange(event)}                       
                    />
                    {
                        image.url.length > 0 &&
                        <div className='image-preview' style={{backgroundImage: `url('${image.url}')`}}>
                            <div className='image-overlay'></div>
                            <div className='remove-btn' onClick={this.handleRemoveImageClick}><AiOutlineCloseCircle/></div>
                        </div>
                    }
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