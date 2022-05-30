import React from 'react'
import { requestForToken, onMessageListener } from '../../firebase';
import OrderCardManage from '../ForProvider/OrderCardManage';
import ProviderOrderDetailModal from '../ForProvider/ProviderOrderDetailModal';
import ChangeDepartureDateModal from './ChangeDepartureDateModal';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { DateRange } from 'react-date-range';
import { Pagination } from "@mui/material";
import { BsArrowRight } from 'react-icons/bs';
import '../../Styles/ForProvider/provider-order.scss'

class ProviderOrder extends React.Component {

    state = {
        orderState: '',
        orders: [],
        selectedOrderDetail: {},
        totalPage: 0,
        totalCount: 0,
        page: 1,
        perPage: 3,
        startDate: new Date(),
        endDate: new Date(),
        keyword: '',
        showDatePicker: false,
        isLoading: false,
        isProcessingOrder: false,
        isLoadingReport: false,
        isShowDetailModal: false,
        selectedOrderId: 0,
        openChangeDateModal: false,
        changingDepartureOrderId: 0,
        currentDepartureDate: ''
    }

    baseUrl = this.props.reduxData.baseUrl;
    broadcast_mes_timestamp = '';

    async componentDidMount() {
        // check jwt token
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
                `${this.baseUrl}/api/Providers/me/orders?state=${orderState}&page=1&perPage=3`,
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
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                this.props.history.push('/login');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    async componentDidUpdate(prevProps, prevState) {
        // check jwt token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        
        // when order state change
        if(prevProps.location.pathname !== this.props.location.pathname) {
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
                    `${this.baseUrl}/api/Providers/me/orders?state=${orderState}&page=1&perPage=3`,
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
                if (error.response.status === 403) {
                    toast.error("Not allowed");
                    // redirect to provider register page or show notification
                    this.props.history.push('/for-provider/register');
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
            const { orderState, keyword } = this.state;
            // call api to get orders and set state
            try {
                this.setState({
                    isLoading: true,
                });
                let res = await axios.get(
                    `${this.baseUrl}/api/Providers/me/orders?state=${orderState}&page=${page}&perPage=${perPage}&keyword=${keyword}`,
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
                if (error.response.status === 403) {
                    toast.error("Not allowed");
                    // redirect to provider register page or show notification
                    this.props.history.push('/for-provider/register');
                }
            } finally {
                this.setState({
                    isLoading: false
                })
            }                         
        }
    } 

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    // get orders
    getOrders = async (keyword) => {
        let _keyword = keyword ? keyword : '';
        console.log('Get orders');
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        const { page } = this.state;
        let orderState = (this.props.location.pathname.split('/').at(-1)).toLowerCase();
        if(orderState !== "pending" && orderState !== "confirmed" && orderState !== "canceled" && orderState !== "processed") {
            orderState = '';
        }     
        try {          
            this.setState({
                isLoading: true
            })     
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/orders?state=${orderState}&page=${1}&perPage=3&keyword=${_keyword}`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );                     
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
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                this.props.history.push('/for-provider/register');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    // call api to change state of order
    changeOrderState = async(orderId, orderState) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        // get type of tab (all, pending or processed)
        let tabType = (this.props.location.pathname.split('/').at(-1)).toLowerCase();
        if(tabType !== "pending" && tabType !== "confirmed" && tabType !== "canceled" && tabType !== "processed") {
            tabType = '';
        } 
        // post to api
        const apiUrl = orderState === 'confirmed' ? 
                        `${this.baseUrl}/api/Orders/${orderId}/confirm` 
                        :
                        `${this.baseUrl}/api/Orders/${orderId}/cancel`;
        try {
            this.setState({
                isProcessingOrder: true
            })   
            let res = await axios.put(
                apiUrl,
                {
                    state: orderState
                },
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  
            // update UI
            let orders = this.state.orders;
            if(tabType === "pending") {
                // remove processed order
                orders = orders.filter((element) => element.id !== res.data.id)
            } else {
                // set state with updated order if tab is not 'pending'
                const index = this.state.orders.findIndex((element) => element.id === res.data.id);
                orders[index] = res.data
            }
            this.setState({
                orders: orders
            })   
            if(tabType === "pending") {
                toast.success('Processed order is moved to others tabs!');
            }           
        } catch (error) {
            if (!error.response) {
                console.log(error)
                toast.error("Network error");
                return;
            }
            if (error.response.status === 400) {
                if(error.response === 'Invalid state.'){
                    console.log(error)
                }
                if(error.response === 'Already in this state.'){
                    console.log(error)
                }
            }
            if (error.response.status === 401) {
                toast.error("Login to continue");
                console.log(error)
            }
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                // this.props.history.push('/for-provider/register');
            }
        } finally {
            this.setState({
                isProcessingOrder: false
            })
        }
    }

    // open order detail modal
    openDetailModal = (orderId) => {
        this.setState({
            isShowDetailModal: true,
            selectedOrderId: orderId
        })
    }

    // close order detail modal
    closeDetailModal = () => {
        this.setState({
            isShowDetailModal: false
        })
    }

    // keyword on change
    keywordInput = (event) => {
        this.setState({
            keyword: event.target.value
        })
    }

    // search order click
    searchOrder = () => {
        const keyword = this.state.keyword;
        this.getOrders(keyword);
    }

    // click date picker toggle
    handleDateClick = () => {
        let showDatePicker = this.state.showDatePicker;
        this.setState({
            showDatePicker: !showDatePicker
        })
    }

    // handle date range change
    handleDateRangeChange = (ranges) => {
        this.setState({
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        })
    }

    // export order report
    exportOrderReport = async () => {
        // check jwt token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        // compose the request
        let { startDate, endDate } = this.state;
        startDate = `${startDate.getFullYear()}-${("0" + (startDate.getMonth()+1)).slice(-2)}-${("0" + startDate.getDate()).slice(-2)}`;
        endDate = `${endDate.getFullYear()}-${("0" + (endDate.getMonth()+1)).slice(-2)}-${("0" + endDate.getDate()).slice(-2)}`;
        console.log('start date', startDate);

        // call api to get the export file's url
        try {          
            this.setState({
                isLoadingReport: true
            })     
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/orders/report?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );                     
            // get file path
            const filePath = res.data.filePath;
            // accessing file's url means download it!
            window.location.href = this.baseUrl+filePath;          
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                //fake api response
                window.location.href = `${this.baseUrl}/report/MyFile.xls`; 
                return;
            }         
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
            if (error.response.status === 403) {
                console.log(error)
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        } finally {
            this.setState({
                isLoadingReport: false
            })
        }         
    }

    
    // open change departure date modal
    openChangeDateModal = (orderId, departureDate) => {
        this.setState({
            openChangeDateModal: true,
            changingDepartureOrderId: orderId,
            currentDepartureDate: departureDate
        })
    }
    // close change departure date modal
    closeChangeDateModal = () => {
        this.setState({
            openChangeDateModal: false
        })
    }

    // update new departure date for an order
    updateNewDeparture = (orderId, departureDate) => {
        let orders = this.state.orders;
        // set state with updated order if tab is not 'pending'
        const index = this.state.orders.findIndex((element) => element.id === orderId);
        orders[index] = {
            ...orders[index], 
            departureDate: departureDate
        };

        this.setState({
            orders: orders,
            openChangeDateModal: false
        })      
    }

    // close all modals
    closeAllModals = () => {
        this.setState({
            openChangeDateModal: false,
            isShowDetailModal: false
        })
    }


    render() {
        const { orders, page, totalPage, isLoading } = this.state;
        const { startDate, endDate, showDatePicker } = this.state;
        const { keyword } = this.state;
        const { isProcessingOrder, isLoadingReport } = this.state;
        const { openChangeDateModal, currentDepartureDate, changingDepartureOrderId } = this.state;
        const { isShowDetailModal, selectedOrderId } = this.state;

        const dateSelectionRange = {
            startDate: startDate,
            endDate: endDate,
            key: 'selection',
        }      
          
        // receive firebase cloud message
        onMessageListener()
        .then((payload) => {
            this.getOrders()
            .then(() => {
                toast.success("New pending order.");
            });       
        })
        .catch((err) => console.log('failed: ', err));

        // receive message in background from fm-sw.js
        const broadcast = new BroadcastChannel('booking-message');       
        broadcast.onmessage = (event) => {
            if(event.data != this.broadcast_mes_timestamp)
            {
                this.broadcast_mes_timestamp = event.data;
                console.log('received background message in order page:', event.data);
                this.getOrders();
            }
        };

        return (
            <div className='provider-order-container'>
                <div className='provider-order-header'>
                    <div className='title'>Orders for your company</div>
                    <div className='sub-title'>See and process tour orders for your company</div>
                </div>
                <div className='order-task-bar'>
                    <div className='order-search-bar'>
                        <input className='order-input-search' placeholder='Order ID, Tourist Name, ...' value={keyword} onChange={this.keywordInput}/>
                        <button className='order-search-btn' onClick={this.searchOrder}>Search</button>
                    </div>
                    <div className='order-export'>
                        <span>Order Date</span>
                        <div className="order-date" onClick={() => this.handleDateClick()}>
                            <div className="date-display">
                                <p>
                                    {
                                        `${("0" + startDate.getDate()).slice(-2)}/${("0" + (startDate.getMonth()+1)).slice(-2)}/${startDate.getFullYear()}
                                        -
                                        ${("0" + endDate.getDate()).slice(-2)}/${("0" + (endDate.getMonth()+1)).slice(-2)}/${endDate.getFullYear()}`
                                    } 
                                </p>
                            </div>
                            {
                                showDatePicker &&
                                <div
                                    className='data-range-picker'
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={this.handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        ranges={[dateSelectionRange]}
                                        maxDate={new Date()}
                                    />
                                </div>
                            }                                        
                        </div>
                        <button className='export-btn' onClick={this.exportOrderReport}>
                            {
                                isLoadingReport &&
                                <div className="loading-container">
                                    <ReactLoading
                                        className="loading-component"
                                        type={"spin"}
                                        color={"#df385f"}
                                        height={20}
                                        width={20}
                                    />
                                </div>
                            }
                            Export
                        </button>
                    </div>
                </div>
                <div className='provider-order-body'>
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
                    {
                        isProcessingOrder &&
                        <div className="loading-container__processing">
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
                                    <OrderCardManage 
                                        key={'order'+item.id} 
                                        order={item} 
                                        openDetailModal={this.openDetailModal}
                                        changeOrderState={this.changeOrderState}
                                        openChangeDateModal={this.openChangeDateModal}
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
                    openChangeDateModal &&
                    <div className='modal-container'>
                        <ChangeDepartureDateModal 
                            changingDepartureOrderId={changingDepartureOrderId}
                            currentDepartureDate={currentDepartureDate}
                            updateNewDeparture={this.updateNewDeparture}
                            closeChangeDateModal={this.closeChangeDateModal}
                        />
                    </div>
                }
                {
                    isShowDetailModal &&
                    <div className='modal-container' onClick={this.closeAllModals}>
                        <ProviderOrderDetailModal 
                            orderId={selectedOrderId}
                            closeDetailModal={this.closeDetailModal}
                            
                        />
                    </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        saveFCMTokenRedux: (token) => dispatch({type: 'SAVE_FCM_TOKEN', payload: token})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProviderOrder));