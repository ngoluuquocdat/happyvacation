import React, { Component } from 'react';
import ReviewItem from './ReviewItem';
import { Pagination, Rating } from '@mui/material';
import {connect} from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../Styles/review-section.scss'

class ReviewSection extends Component {
    state = {
        reviews: [],
        totalPage: 2,
        totalCount: 12,
        page: 1,
        perPage: 4,
        rating: 0,
        content: '',
        hoverLabel: '',
        ratingLabel: '',
        flag: 1,    // this is changed between 1 and 2, to detect if new review posted or not in componentDidUpdate
        networkFailed: false,
        isPosting: false,
        isUserEnabled: true
    }
    tourId = this.props.tourId ? this.props.tourId : 0;
    ratingLabels = ['','Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        // call api to get list of comments, then set state
        const {page, perPage} = this.state;
        const tourId = this.tourId;
        if(tourId) {
            //console.log(`request: GET api/tours/${tourId}/reviews?page=${page}&perPage=${perPage}`)
            try {
                let res = await axios.get(
                    `${this.baseUrl}/api/tours/${tourId}/reviews?page=${page}&perPage=${perPage}`
                );       
                //console.log(res);
                this.setState({
                    totalCount: res.data.totalCount,
                    totalPage: res.data.totalPage,
                    reviews: res.data.items
                })
                
            } catch (error) {
                if (!error.response) {
                    toast.error("Network error");
                    console.log(error)
                    // fake api res
                    const resComments = reviews_temp.slice((page-1)*perPage, (page-1)*perPage+perPage);
                    this.setState({
                        reviews: resComments,
                        networkFailed: true
                    })
                    return;
                } 
                if (error.response.status === 404) {
                    console.log(error)
                }
                if (error.response.status === 400) {
                  console.log(error)
                }
            } finally {
                
            }            
        }
        // call api to check if user is disabled or not
        await this.checkUserEnabled();
    }

    async componentDidUpdate (prevProps, prevState) {
        // call api again if page change
        if(prevState.page !== this.state.page) {
          const {page, perPage} = this.state;
          const tourId = this.props.tourId;
          console.log(`request: GET /tours/${tourId}/reviews?page=${page}&perPage=${perPage}`)
          // fake api res
          const resReviews = reviews_temp.slice((page-1)*perPage, (page-1)*perPage+perPage);
          this.setState({
            reviews: resReviews
          })
        }
        // call api again after posting a new review
        if(prevState.flag !== this.state.flag) {
            const {perPage} = this.state;
            const tourId = this.props.tourId;
            //console.log(`request: GET /tours/${tourId}/reviews?page=1&perPage=${perPage}`)
            try {
                let res = await axios.get(
                    `${this.baseUrl}/api/tours/${tourId}/reviews?page=1&perPage=${perPage}`
                );       
                //console.log(res);
                this.setState({
                    totalCount: res.data.totalCount,
                    totalPage: res.data.totalPage,
                    reviews: res.data.items
                })
                
            } catch (error) {
                if (!error.response) {
                    toast.error("Network error");
                    console.log(error)
                    // fake api res
                    const resComments = reviews_temp.slice(1*perPage, (1-1)*perPage+perPage);
                    this.setState({
                        reviews: resComments,
                        networkFailed: true
                    })
                    return;
                } 
                if (error.response.status === 404) {
                    console.log(error)
                }
                if (error.response.status === 400) {
                  console.log(error)
                }
            } finally {
                
            }
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
    handleOnSubmitReview = async () => {
        const {rating, content} = this.state;
        const token = localStorage.getItem('user-token');
        if(rating !== 0)
        {
            const review = {
                tourId: this.tourId,
                content: content,
                rating: rating
            }
            // post new review to api
            console.log(`POST tours/${review.tourId}/reviews`, review)
            try {
                let res = await axios.post(
                  `${this.baseUrl}/api/tours/${review.tourId}/reviews`,
                  review,
                  {
                    headers: { Authorization:`Bearer ${token}` }
                  }
                );          
                console.log(res);
                // reset state, toggle flag to re-fetch reviews data
                const flag = this.state.flag;
                this.setState({
                    rating: 0,
                    content: '',
                    hoverLabel: '',
                    ratingLabel: '',
                    flag: flag!==1 ? 1 : 2  // toggle between 1 and 2
                })     
            } catch (error) {
                if (!error.response) {
                  toast.error("Network error");
                  console.log(error)
                  return;
                }
                if (error.response.status === 400) {
                    toast.warning("Please give rating value.");
                }
                if (error.response.status === 401) {
                  console.log(error);
                  // redirect to login page or show notification
                  this.props.history.push('/login');
                }
            } finally {
                this.setState({
                    isPosting: false
                })
            }          
        } else {
            toast.warning("Please give your rating.");
        }
    }

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
          page: page
        })
    }

    // check if user is disabled or not
    checkUserEnabled = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            // this.props.history.push('/login');\
            return
        }
        try {            
            let res = await axios.get(
                `${this.baseUrl}/api/Users/me/check-enabled`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );                     
            this.setState({
                isUserEnabled: res.data.isEnabled
            })       
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
        }
    }

    render() {
        //const currentUser = this.props.reduxData.user;
        // const isCurrentUserExist = ((currentUser!=null)&&(Object.keys(currentUser).length !== 0 && currentUser.constructor === Object));
        const isCurrentUserExist = localStorage.getItem('user-token') && localStorage.getItem('user-token').length > 0;
        const isOrderedByUser = this.props.isOrderedByUser;
        const { reviews, isUserEnabled } = this.state;
        const { totalCount, page, totalPage } = this.state;
        const { content, rating, hoverLabel, ratingLabel } = this.state;
        const baseUrl = this.state.networkFailed ? '' : this.baseUrl;

        return (           
            <div className='review-section'>
                {
                    isCurrentUserExist ?                     
                    <>
                        {
                            // isOrderedByUser ?
                            isUserEnabled ?
                            <>
                                {
                                    isOrderedByUser ? 
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
                                    <span className='notify'>You can leave your review after experiencing this tour!</span>
                                }
                            </>
                            :
                            // <span className='notify'>You can leave your review after experiencing this tour!</span>
                            <span className='notify'>You have been disabled.</span>
                        }
                    </>                                           
                    : 
                    <span className='notify'>Login to leave your review!</span>
                }
                <div className='list-reviews'>
                    <span className='review-count'>{totalCount} reviews</span>
                    {
                        reviews.length > 0 && 
                        reviews.map((item) => {
                            return (
                                <ReviewItem key={item.id} review={item} baseUrl={baseUrl}/>
                            )
                        })
                    }
                </div>
                <div className='pagination'>
                    {
                        totalPage > 1 &&
                        <Pagination 
                            count={totalPage} 
                            shape="rounded" 
                            siblingCount={1}
                            page={page}
                            onChange={(event, page) => this.handleOnChangePage(event, page)}
                        />
                    }
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
  