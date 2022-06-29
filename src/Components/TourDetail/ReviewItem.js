import React, { Component } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';
import Rating from '@mui/material/Rating';
import {connect} from 'react-redux';
import '../../Styles/review-item.scss'

class ReviewItem extends Component {

    render() {
        //const baseUrl = this.props.reduxData.baseUrl;
        const baseUrl = this.props.baseUrl;
        const review = this.props.review;
        return (           
            <div className='review-item' onClick={() => this.handleOpenContent()}>
                <div className='left'>
                    <img className='user-avatar' src={baseUrl+review.userAvatar}/>
                </div>
                <div className='right'>
                    <div className='header'>
                        <span className='user-name'>{review.username}</span>
                        <span className='comment-date'>{review.date}</span>
                    </div>
                    {
                        review.isUserEnabled ?
                        <>
                            {
                                review.rating > 0 ?
                                <Rating
                                    name="simple-controlled"
                                    value={review.rating}
                                    precision={0.5}
                                    size="small"
                                    readOnly
                                />
                                :
                                <span className='not-rated-label'>Not rated</span>
                            }
                            <p className='comment-content'>{review.content}&nbsp;</p>
                        </>
                        :
                        <p className='disabled-label'>This review is hidden.</p>
                    }
                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(ReviewItem);

  