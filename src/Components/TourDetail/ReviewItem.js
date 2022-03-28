import React, { Component } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';
import Rating from '@mui/material/Rating';
import '../../Styles/review-item.scss'

class ReviewItem extends Component {

    render() {
        const comment = this.props.comment;
        return (           
            <div className='review-item' onClick={() => this.handleOpenContent()}>
                <div className='left'>
                    <img className='user-avatar' src={comment.userAvatar}/>
                </div>
                <div className='right'>
                    <div className='header'>
                        <span className='user-name'>{comment.username}</span>
                        <span className='comment-date'>{comment.date}</span>
                    </div>
                    {
                        comment.rating > 0 ?
                        <Rating
                            name="simple-controlled"
                            value={comment.rating}
                            precision={0.5}
                            size="small"
                            readOnly
                        />
                        :
                        <span className='not-rated-label'>Not rated</span>
                    }
                    <p className='comment-content'>{comment.content}&nbsp;</p>
                </div>
            </div>
        );
    }
}

export default ReviewItem;
  