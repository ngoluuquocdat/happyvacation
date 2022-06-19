import React, { Component } from 'react';
import axios from "axios";
import MessageCard from '../../MessageCard';
import { BsFillPlusCircleFill, BsCardImage, BsFillStickyFill } from 'react-icons/bs';
import { RiFileGifFill } from 'react-icons/ri';
import { connect } from 'react-redux';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import "../../../Styles/ForProvider/provider-chat-box.scss";

class ChatBox extends Component {

    state = {
        message_content: '',
        image: { url: '', file: null }
    }

    baseUrl = this.props.reduxData.baseUrl;

    // input message
    inputMessage = (e) => {
        this.setState({
            message_content: e.target.value
        })
    }

    // on image change
    onImageChange = (event) => {  
        console.log('on change image')     
        if (event.target.files && event.target.files[0]) {
            let image = this.state.image;
            image.url = URL.createObjectURL(event.target.files[0]);
            image.file = event.target.files[0];
            event.target.value = null;
            this.setState({
                image: image
            });
        }
    }

    // remove image
    handleRemoveImageClick = () => {
        this.setState({
            image: { url: '', file: null }
        })
    } 
    
    // click send button
    sendMessage = async () => {
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

            this.props.sendMessage(message_content, image_url);

            this.setState({
                message_content: '',
                image: { url: '', file: null }
            })
        }
    }
    
    render() {
        const { userId, withUser, messages } = this.props
        const avatarUrl = `url('${this.baseUrl+withUser.avatarUrl}')`;
        const { message_content, image } = this.state;

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
                        messages.slice().reverse().map((item, index, array) => {
                            return (
                                <MessageCard 
                                    key={index} 
                                    userId={userId} 
                                    withUserId={withUser.id} 
                                    message={item}
                                    wide={true}
                                    topSpacing={array[index+1] ? array[index+1].senderId !== item.senderId : false}
                                    bottomSpacing={array[index-1] ? array[index-1].senderId !== item.senderId : false}
                                />
                            )
                        })
                        :
                        <span>Nothing here yet! Say something!</span>
                    }
                </div>
                {
                    withUser.isUserEnabled ?
                    <div className="new-message-input">
                        <div className="input-controls">
                            <label className='control-label'>
                                <BsFillPlusCircleFill className='icon'/>
                            </label>
                            <label className='control-label' htmlFor='input-image'>
                                <BsCardImage className='icon' />
                            </label>
                            <label className='control-label'>
                                <BsFillStickyFill className='icon'/>
                            </label>
                            <label className='control-label'>
                                <RiFileGifFill className='icon'/>
                            </label>    
                        </div>
                        <input 
                            className='input-field' 
                            placeholder='Your message...'
                            value={message_content}
                            onChange={this.inputMessage}
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
                        <button className='send-btn' onClick={this.sendMessage}>Send</button>
                    </div>
                    :
                    <div className='disabled-label'>This user has been disabled.</div>
                }
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