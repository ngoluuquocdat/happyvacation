import React, { Component } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import '../../Styles/itinerary.scss'

class Itinerary extends Component {
    state = {
        isShowContent: false
    }

    // toggle showing content
    handleOpenContent = () => {
        const isShowContent = this.state.isShowContent;
        this.setState({
            isShowContent: !isShowContent
        })
    }

    render() {
        const itinerary = this.props.itinerary;
        const isShowContent = this.state.isShowContent
      
        return (           
            <div className='itinerary-item' onClick={() => this.handleOpenContent()}>
                <div className='header'>
                    <h5>{itinerary.title}</h5>
                    <FaCaretDown />
                </div>
                {
                    isShowContent &&
                    <div className='content' onClick={(event) => event.stopPropagation()}>
                        <p className='content-text'>{itinerary.content}</p>
                    </div>         
                }
            </div>
        );
    }
}

export default Itinerary;
  