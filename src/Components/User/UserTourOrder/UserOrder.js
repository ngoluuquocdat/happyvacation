import React from 'react'
import OrderCard from '../../OrderCard'
import UserOrderDetailModal from './UserOrderDetailModal';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { Pagination } from "@mui/material";
import '../../../Styles/user-order.scss'

class UserOrder extends React.Component {

    state = {
        orderState: '',
        orders: [],
        totalPage: 0,
        totalCount: 0,
        page: 1,
        perPage: 3,
        isShowDetailModal: false, 
        selectedOrderId: 0
    }

    baseUrl = this.props.reduxData.baseUrl;
    //orderState = this.props.orderState ? this.props.orderState : ""; 

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    async componentDidMount() {
         // call api to get providers     
        console.log(`GET users/me`);

        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }

        // check the route to get order state
        let orderState = (this.props.location.pathname.split('/').at(-1)).toLowerCase();
        console.log('order state: ', orderState)
        if(orderState !== "pending" && orderState !== "confirmed" && orderState !== "canceled" && orderState !== "processed") {
            orderState = '';
        }          

        try {          
            this.setState({
                isLoading: true,
            });
            let res = await axios.get(
                `${this.baseUrl}/api/Orders/me?state=${orderState}&page=1&perPage=3`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );          
            // console.log(res);
            
            // set state
            this.setState({
                totalPage: res.data.totalPage,
                orders: res.data.items,
                orderState: orderState
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                //fake api response
                const resOrders = orders;
                // set state`   
                this.setState({
                    orders: resOrders
                }); 
                return;
            }
            if (error.response.status === 400) {
                console.log(error)
            }
            if (error.response.status === 401) {
                console.log(error);
             // redirect to login page or show notification
             this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    async componentDidUpdate(prevProps, prevState) {
        //console.log('route', this.props.location.pathname)
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        
        // when order state change
        if(prevProps.location.pathname !== this.props.location.pathname) {
            let orderState = (this.props.location.pathname.split('/').at(-1)).toLowerCase();
            console.log('order state: ', orderState)
            if(orderState !== "departed" && orderState !== "confirmed" && orderState !== "canceled") {
                orderState = '';
            }          
            try {
                this.setState({
                    isLoading: true,
                });
                let res = await axios.get(
                    `${this.baseUrl}/api/Orders/me?state=${orderState}&page=1&perPage=3`,
                    {
                        headers: { Authorization:`Bearer ${token}` }
                    }
                );          
                // console.log(res);
                
                // set state
                this.setState({
                    totalPage: res.data.totalPage,
                    orders: res.data.items,
                    orderState: orderState
                })
            } catch (error) {
                if (!error.response) {
                    toast.error("Network error");
                    console.log(error)
                    //fake api response
                    const resOrders = orders;
                    // set state`   
                    this.setState({
                        orders: resOrders
                    }); 
                    return;
                }
                if (error.response.status === 400) {
                    console.log(error)
                }
                if (error.response.status === 401) {
                    console.log(error);
                 // redirect to login page or show notification
                 this.props.history.push('/login', {prevPath: this.props.location.pathname});
                }
            } finally {
                this.setState({
                    isLoading: false
                })
            }    
        }

        // when page change
        if (prevState.page !== this.state.page) {
            const { page, perPage } = this.state;
            const { orderState } = this.state;
            // call api to get orders and set state
            try {
                this.setState({
                    isLoading: true,
                });
                let res = await axios.get(
                    `${this.baseUrl}/api/Orders/me?state=${orderState}&page=${page}&perPage=${perPage}`,
                    {
                        headers: { Authorization:`Bearer ${token}` }
                    }
                );          
                // console.log(res);
                
                // set state
                this.setState({
                    totalPage: res.data.totalPage,
                    orders: res.data.items,
                    page: page
                })
            } catch (error) {
                if (!error.response) {
                    toast.error("Network error");
                    console.log(error)
                    //fake api response
                    const resOrders = orders;
                    // set state`   
                    this.setState({
                        orders: resOrders
                    }); 
                    return;
                }
                if (error.response.status === 400) {
                    console.log(error)
                }
                if (error.response.status === 401) {
                    console.log(error);
                 // redirect to login page or show notification
                 this.props.history.push('/login', {prevPath: this.props.location.pathname});
                }
            } finally {
                this.setState({
                    isLoading: false
                })
            }                         
        }

    } 

    // open order detail modal
    openDetailModal = (orderId) => {
        this.setState({
            isShowDetailModal: true,
            selectedOrderId: orderId
        })
    }

    // close all modals
    closeAllModals = () => {
        this.setState({
            isShowDetailModal: false
        })
    }

    render() {
        const { orders, page, totalCount, totalPage, isLoading, isShowDetailModal, selectedOrderId } = this.state;
        return (
            <div className='user-order-container'>
                <div className='user-order-header'>
                    <div className='title'>Your Tour Orders</div>
                    <div className='sub-title'>See your tour orders</div>
                </div>
                <div className='user-order-body'>
                    {
                        isLoading && 
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
                    <div className='list-order'>
                        {
                            orders.map((item) => {
                                return (
                                    <OrderCard 
                                        key={item.id} 
                                        order={item}
                                        openDetailModal={this.openDetailModal}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                {totalPage > 1 && (
                    <div className="pagination-container">
                        <Pagination
                            count={totalPage}
                            shape="rounded"
                            siblingCount={1}
                            page={page}
                            onChange={(event, page) =>
                                this.handleOnChangePage(event, page)
                            }
                        />
                    </div>
                )}
                {
                    isShowDetailModal &&
                    <div className='modal-container' onClick={this.closeAllModals}>
                        <UserOrderDetailModal 
                            orderId={selectedOrderId}
                            closeDetailModal={this.closeDetailModal}
                            
                        />
                    </div>
                }
            </div>
        )
    }
}

const orders = [
    {
        id: 1,
        tourId: 1,
        tourName: 'HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE',
        departureDate: '14/04/2022',
        modifiedDate: '10/04/2022',
        duration: 0.5,
        isPrivate: false,
        adults: 2,
        children: 1,
        pricePerAdult: 45,
        pricePerChild: 22,
        totalPrice: 112.50,
        thumbnailUrl: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/Foodie_11-150x150.jpg',
        state: 'Confirmed',
        providerId: 1,
        providerName: 'Hoi An Express'
    }
]

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserRedux: (user) => dispatch({type: 'SAVE_USER', payload: user})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserOrder));