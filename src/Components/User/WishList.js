import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import '../../Styles/wish-list.scss';

class WishList extends React.Component {

    state = {
        wishList: [],
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        this.getWishList();
    }

    getWishList = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        try {
            this.setState({
                isLoading: true
            });
            let res = await axios.get(
                `${this.baseUrl}/api/Users/me/wish-list`,
                { headers: { Authorization:`Bearer ${token}` } }
            );
            this.setState({
                wishList: res.data.map(item => ({
                    ...item, 
                    isInUserWishList: true
                }))
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                return;
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        } finally {
            this.setState({
                isLoading: false
            });
        }
    }

    addOrRemoveWishList = async(tourId, action) => {
        let res = {};
        const token = localStorage.getItem('user-token');
        if(!token) {
            toast.info('You need to login to continue.',
            {
                onClick: () => {this.props.history.push('/login', {prevPath: this.props.location.pathname});}
            });
            return;
        }
        try {
            if(action === "ADD") {
                res = await axios.post(
                    `${this.baseUrl}/api/Users/me/wish-list?tourId=${tourId}`,
                    {},
                    { headers: { Authorization:`Bearer ${token}` } }
                );
                toast.success("Added to your wish list.")
            } 
            if(action === "REMOVE") {
                res = await axios.delete(
                    `${this.baseUrl}/api/Users/me/wish-list?tourId=${tourId}`,
                    { headers: { Authorization:`Bearer ${token}` } }
                );
                toast.success("Removed from your wish list.");
            }

            // update UI
            let wishList = this.state.wishList;
            const index = wishList.findIndex((el) => el.tourId === tourId);
            wishList[index].isInUserWishList = res.data.isInUserWishList;

            this.setState({
                wishList: wishList
            })
        } catch(error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                return;
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        }
    }

    render() {
        const wishList = this.state.wishList;
        return (
            <div className='wish-list-page-wrapper'>
                <div className='wish-list-page-header'>
                    <div className='title'>Your Favorite Tours</div>
                    <div className='sub-title'>See your favorite tours</div>
                </div>
                <div className='wish-list-page-body'>
                    <div className='wish-list'>
                        {
                            wishList.map(item => {
                                return (
                                    <div key={item.id} className='wish-item'>
                                        <div className='tour-thumbnail' style={{backgroundImage: `url('${this.baseUrl+item.thumbnailPath}')`}}></div>
                                        <div className='tour-content'>
                                            <span className='tour-name' onClick={() => this.props.history.push(`/tours/${item.tourId}`)}>
                                                {item.tourName}
                                            </span>
                                            <div className='tour-provider' onClick={() => this.props.history.push(`/providers/${item.providerId}`)}>
                                                <div className='tour-provider-avatar' style={{backgroundImage: `url('${this.baseUrl+item.providerAvatar}')`}}></div>
                                                {item.providerName}
                                            </div>
                                        </div>
                                        <button className="favorite-btn" 
                                            onClick={() => this.addOrRemoveWishList(item.tourId, item.isInUserWishList ? "REMOVE" : "ADD")}
                                        >
                                            {item.isInUserWishList ? <BsHeartFill/> : <BsHeart/>}
                                        </button>
                                    </div>
                                )
                            })
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

export default connect(mapStateToProps)(withRouter(WishList));