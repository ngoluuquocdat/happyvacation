import React from 'react'
import HeaderNav from './Header/HeaderNav';
import TopTours from './HomePage/TopTours';
import TourCard from './TourCard';
import UserChatBox from './UserChatBox';
import axios from "axios";
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Pagination } from "@mui/material";
import { toast } from 'react-toastify';
import { FaCaretDown } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr';

import '../Styles/provider-page.scss'

class ProviderPage extends React.Component {

    state = {
        provider: {},
        tours: [],
        totalPage: 1,
        totalCount: 8,
        page: 1,
        perPage: 8,
        sort: 'latest',
        isShowSortMenu: false,
        isLoadingProvider: false,
        isLoadingAvailable: false,
        isOpenChatBox: false   
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        // call api to get providers     
        const providerId = this.props.match.params.id;
        console.log(`GET providers/${providerId}`);
        try {
            this.setState({
                isLoadingProvider: true,
            });   
            let res = await axios.get(`${this.baseUrl}/api/Providers/${providerId}`);
            //console.log(res);
            const resProvider = res.data;
            this.setState({
                provider: resProvider,
            });
        } catch (error) {
            if (!error.response) {
                toast.error('Network error')
                return;
            }
            if (error.response.status === 404) {
                console.log(error);
            }
            if (error.response.status === 400) {
                console.log(error);
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoadingProvider: false,
                });
            }, 1000);
        }      

        // call api to get tours
        const { perPage } = this.state;
        this.fetchDataTour(1, perPage, 'latest') 
    }

    componentDidUpdate(prevProps, prevState) { 
        const providerId = this.props.match.params.id;
        // when page change
        if(prevState.page !== this.state.page && prevState.tours === this.state.tours) {
            const { page, perPage, sort } = this.state;
            // call api to get tours and set state
            this.fetchDataTour(page, perPage, sort)
        }
        // when sort option change 
        if(prevState.sort !== this.state.sort) {
            const { page, perPage, sort } = this.state;
            // call api to get tours and set state
            this.fetchDataTour(page, perPage, sort)
        }
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            if(this.props.reduxData.user === null) {
                window.location.reload();
                return;
            }
        }
    }

    async fetchDataTour(page, perPage, sort) {
		try {
            this.setState({
                isLoadingAvailable: true,
            });   
            let res = await axios.get(`${this.baseUrl}/api/Tours?page=${page}&perPage=${perPage}&sort=${sort}`);
            this.setState({
                tours: res.data.items,
                totalPage: res.data.totalPage
            });
        } catch (error) {
            if (!error.response) {
                toast.error('Network error')
                return;
            }
            if (error.response.status === 404) {
                console.log(error);
            }
            if (error.response.status === 400) {
                console.log(error);
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoadingAvailable: false,
                });
            }, 1000);
        }
	}

    // toggle sort menu
    handleToggleSortMenu = () => {
        const isShowSortMenu = this.state.isShowSortMenu;
        this.setState({
            isShowSortMenu: !isShowSortMenu
        })
    }

    // change sort option
    handleSortOptionChange = (event) => {
        this.setState({
            sort: event.target.value,
            isShowSortMenu: false
        })
    }

      // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    render() {
        const providerId = this.props.match.params.id;
        const { tours, provider, totalCount, page, totalPage } = this.state;
        const isToursEmpty = provider.tourAvailable === 0;
        const isLoadingProvider = this.state.isLoadingProvider;
        const { sort, isShowSortMenu, isOpenChatBox } = this.state;
        const url = `url('${this.baseUrl+provider.avatarUrl}')`;

        return (
            <div className="App">
                <div className="small-header">
                    <HeaderNav />
                </div>
                <div className="provider-page-container">
                    <div className="provider-section">
                        {
                            isLoadingProvider &&
                            <div className="loading-container">
                                <ReactLoading
                                    className="loading-component"
                                    type={"spin"}
                                    color={"#df385f"}
                                    height={50}
                                    width={50}
                                />
                            </div>
                        }
                        <div className="provider-section-left">
                            <div className="provider-avatar" style={{backgroundImage: url}} />
                        </div>
                        <div className='provider-section-right'>
                            <h2 className='provider-name'>{provider.name}</h2>
                            <div className='provider-info'>
                                <div className='provider-main-info'>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Member Since:
                                            <span className="content">{provider.dateCreated}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <FiStar/>
                                        <div className="group">
                                            Average Rating:
                                            <span className="content">{provider.averageRating}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Available:
                                            <span className="content">{provider.tourAvailable} tours</span>
                                        </div>
                                    </div>                             
                                </div>
                                <div className='provider-contact-info'>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Email:
                                            <span className="content">{provider.email}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <HiOutlinePhone/>
                                        <div className="group">
                                            Phone:
                                            <span className="content">{provider.phone}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <GrLocation/>
                                        <div className="group">
                                            <span className="content">{provider.address}</span>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            <div className='provider-description'>
                                <span>Description:</span>
                                <p>{provider.description}</p>
                            </div> 
                            <button className='open-chat-btn' onClick={() => this.setState({isOpenChatBox: !this.state.isOpenChatBox})}>CHAT</button>
                        </div>
                    </div>
                    <hr className="section-divide-hr"></hr>
                    {
                        isToursEmpty ?
                        <div>This provider doesn't have any available tour now...</div>
                        :
                        <>
                            <TopTours isSmall={true} providerId={providerId} count={4}/>
                            <hr className="section-divide-hr"></hr>
                            <div className="available-tours-section">
                                <div className="header">
                                    <h3 className="title">Available Tours</h3>
                                    <div className="sort-container">
                                        <span className="sort-btn" onClick={this.handleToggleSortMenu}>Sort <FaCaretDown /></span>
                                        {
                                            isShowSortMenu &&
                                            <div className="sort-option-list">
                                                <h3 className="sort-title">SORT BY</h3>
                                                <form className="sort-form">
                                                    <span className="sort-sub-title">New Tours</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="latest"  
                                                        name="sort"
                                                        value="latest"
                                                        checked={sort==='latest'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="latest">Latest</label>
                                                    </div>
                                                    <span className="sort-sub-title">Price</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="price-up"  
                                                        name="sort"
                                                        value="price-up"
                                                        checked={sort==='price-up'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="price-up">Low to High</label>
                                                    </div>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="price-down" 
                                                        name="sort"
                                                        value="price-down" 
                                                        checked={sort==='price-down'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="price-down">High to Low</label>
                                                    </div>
                                                    <span className="sort-sub-title">Rating</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="rating"  
                                                        name="sort"
                                                        value="rating"
                                                        checked={sort==='rating'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="rating">Highest</label>
                                                    </div>
                                                </form>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="list-tours">
                                    {tours.map((item) => {
                                        return <TourCard tour={item} key={item.id} isSlideItem={false} baseUrl={this.baseUrl}/>;
                                    })}
                                </div>
                                {
                                    totalPage > 1 && (
                                    <div className="pagination-container">
                                        <Pagination
                                            count={totalPage}
                                            shape="rounded"
                                            siblingCount={1}
                                            page={page}
                                            onChange={(event, page) => this.handleOnChangePage(event, page)}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    }
                    {
                        isOpenChatBox &&
                        <div className='user-chat-box-container'>
                            <UserChatBox 
                                providerId={provider.id} 
                                providerName={provider.name}
                                providerAvatar={provider.avatarUrl}
                                closeChatBox={() => this.setState({isOpenChatBox: false})}
                            />  
                        </div>        
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(ProviderPage));