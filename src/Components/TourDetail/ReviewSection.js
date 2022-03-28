import React, { Component } from 'react';
import ReviewItem from './ReviewItem';
import { Pagination, Rating } from '@mui/material';
import {connect} from 'react-redux';
import '../../Styles/review-section.scss'

class ReviewSection extends Component {
    state = {
        reviews: [],
        totalPage: 2,
        totalCount: 12,
        page: 1,
        perPage: 6,
        rating: 0,
        content: '',
        hoverLabel: '',
        ratingLabel: '',
    }
    tourId = this.props.tourId ? this.props.tourId : 0
    ratingLabels = ['','Terrible', 'Poor', 'Average', 'Good', 'Excellent']

    componentDidMount() {
        // call api to get list of comments, then set state
        const {page, perPage} = this.state;
        const tourId = this.tourId;
        if(tourId) {
            console.log(`request: GET /tours/${tourId}/comments?page=${page}&perPage=${perPage}`)
            // fake api res
            const resComments = reviews_temp.slice((page-1)*perPage, (page-1)*perPage+perPage);
            this.setState({
                reviews: resComments
            })
        }
    }

    componentDidUpdate (prevProps, prevState) {
        // call api again if page change
        if(prevState.page !== this.state.page) {
          const {page, perPage} = this.state;
          const tourId = this.props.tourId;
          console.log(`request: GET /tours/${tourId}/comments?page=${page}&perPage=${perPage}`)
          // fake api res
          const resReviews = reviews_temp.slice((page-1)*perPage, (page-1)*perPage+perPage);
          this.setState({
            reviews: resReviews
          })
        }
    }

    // rating hover to show label
    handleOnHoverRating = (event, hoverValue) => {
        if(hoverValue === -1 ) {
            hoverValue = 0;
        }
        this.setState({
            hoverLabel: this.ratingLabels[hoverValue],
        })
    }

    // rating choose
    handleOnChangeRating = (event, newValue) => {
        if(newValue === null) {
            newValue = 0;
        }
        if(newValue === 0) {
            this.setState({
                rating: newValue,
                ratingLabel: ''
            })
        } else {
            this.setState({
                rating: newValue,
                ratingLabel: this.ratingLabels[newValue]
            })
        }
    }

    // content change
    handleOnChangeContent = (event) => {
        this.setState({
            content: event.target.value
        })
    }

    // review submit
    handleOnSubmitReview = () => {
        const review = {
            tourId: this.tourId,
            content: this.state.content,
            rating: this.state.rating
        }
        console.log(`POST tours/${review.tourId}/reviews`, review)
        this.setState({
            rating: 0,
            content: '',
            hoverLabel: '',
            ratingLabel: ''
        })
    }

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
          page: page
        })
      }

    render() {
        const currentUser = this.props.reduxData.user;
        const isCurrentUserExist = ((currentUser!=null)&&(Object.keys(currentUser).length !== 0 && currentUser.constructor === Object));
        //const isCurrentUserExist = false;
        const reviews = this.state.reviews;
        const { totalCount, page, totalPage } = this.state;
        const { content, rating, hoverLabel, ratingLabel } = this.state;
        return (           
            <div className='review-section'>
                {
                    isCurrentUserExist ? 
                    <div className='review-form'>
                        <span className='review-form-title'>Leave your review for this tour!</span>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={this.handleOnChangeRating}
                            onChangeActive={this.handleOnHoverRating}
                            size="large"
                        />
                        <span className='rating-label'>{hoverLabel.length>0 ? hoverLabel : ratingLabel}&nbsp;</span>
                        <textarea 
                            className='comment-input'
                            placeholder='Your review...' 
                            value={content}
                            onChange={this.handleOnChangeContent}                          
                        />
                        <button className='submit-btn' onClick={this.handleOnSubmitReview}>LEAVE REVIEW</button>
                    </div>
                    : 
                    <span className='notify'>Login to leave your review!</span>
                }
                <div className='list-reviews'>
                <span className='review-count'>{totalCount} reviews</span>
                    {
                        reviews.map((item) => {
                            return (
                                <ReviewItem key={item.id} comment={item}/>
                            )
                        })
                    }
                </div>
                <div className='pagination'>
                    <Pagination 
                        count={totalPage} 
                        shape="rounded" 
                        siblingCount={1}
                        page={page}
                        onChange={(event, page) => this.handleOnChangePage(event, page)}
                    />
                </div>
            </div>
        );
    }
}

const reviews_temp = [
    {
        id: 1,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 4,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 2,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 4,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 3,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 4,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 5,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 6,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 7,
        date: '28/03/2022',
        content: 'This is the starting comment of page 2',
        rating: 0,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 8,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 9,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 10,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 11,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
    {
        id: 12,
        date: '28/03/2022',
        content: 'This is a good tour! A lot of interesting experiences.',
        rating: 2,
        username: 'quocdat',
        userAvatar: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.6435-9/71102726_958670581135493_6829330061741522944_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=mZTR_LReJlUAX9V8QPj&_nc_ht=scontent.fdad3-4.fna&oh=00_AT_a4z527ZUBE0xtDWkiandkQYUX5d0tKhqtFrpFelDMzw&oe=6265AC47'
    },
]

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(ReviewSection);
  