import React from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { Pagination } from "@mui/material";
import DonutChart from 'react-donut-chart';
import { Calendar } from 'react-date-range';
import { FiStar } from 'react-icons/fi'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr';
import QuarterPicker from '../QuarterPicker';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../../Styles/ForAdmin/provider-detail-manage.scss'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class ProviderDetailManage extends React.Component {

    state = {
        provider: {},
        tours: [],
        revenueReport: {
            monthLabels: [],
            revenue: []
        },
        totalPage: 1,
        totalCount: 8,
        page: 1,
        perPage: 4,
        sort: 'latest',
        isShowSortMenu: false,
        isLoadingProvider: false,
        isLoadingTour: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        // call api to get providers     
        const providerId = this.props.match.params.id;
        await this.getProvider(providerId)

        // call to get all tours
        await this.fetchDataTour(providerId);
    }

    componentDidUpdate(prevProps, prevState) { 
        const providerId = this.props.match.params.id;
        // when page change
        if(prevState.page !== this.state.page && prevState.tours === this.state.tours) {
            const { page, perPage, sort } = this.state;
            // call api to get tours and set state
            this.fetchDataTour(providerId)
        }
    }

    // get provider
    async getProvider(providerId) {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login');
        }
		try {
            this.setState({
                isLoadingProvider: true,
            });   
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/${providerId}/manage`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );
            this.setState({
                provider: res.data,
            });
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
        } finally {
            this.setState({
                isLoadingProvider: false
            })
        }
	}

    // disable/enable provider
    disableEnableProvider = async () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login');
        }
        const providerId = this.props.match.params.id;
        const isEnabled = this.state.provider.isEnabled;
        let apiUrl = isEnabled 
                    ? `${this.baseUrl}/api/providers/${providerId}/disable` 
                    : `${this.baseUrl}/api/providers/${providerId}/enable`;
        try {
            this.setState({
                isLoadingProvider: true,
            });   

            let res = await axios.put(
                apiUrl,
                {},
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );

            this.setState({
                provider: {
                    ...this.state.provider,
                    isEnabled: res.data.isEnabled
                },
            });
            toast.success(res.data.isEnabled ? "Enabled this provider." : "Disabled this provider.");
        } catch(error) {
            if (!error.response) {
                toast.error("Network error");
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoadingProvider: false
                })
            }, 1000);         
        }
    }

    // get tours
    async fetchDataTour(providerId) {
		try {  
            const token = localStorage.getItem('user-token');
            if(!token) {
                this.props.history.push('/admin/login');
            }        
            this.setState({
                isLoadingTour: true,
            });      
            const {sort, page, perPage} = this.state;      
            var params = new URLSearchParams();
            params.append("sort", sort);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(
                `${this.baseUrl}/api/Providers/${providerId}/manage/tours`,
                {
                    headers: { Authorization:`Bearer ${token}` },
                    params: params,
                }
            );          
            // console.log(res);            
            // set state
            this.setState({
                totalPage: res.data.totalPage,
                totalCount: res.data.totalCount,
                tours: res.data.items                
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
                this.props.history.push('/login/admin');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
        } finally {
            this.setState({
                isLoadingTour: false
            })
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

    // getRevenue
    getRevenue = async(quarter, year) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login');
        }
        const providerId = this.props.match.params.id;
		try {
            // this.setState({
            //     isLoadingProvider: true,
            // });   
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/${providerId}/manage/revenue?quarterIndex=${quarter}&year=${year}`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );
            this.setState({
                revenueReport: res.data,
            });
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login/admin');
            }
        } finally {
            // this.setState({
            //     isLoadingProvider: false
            // })
        }
    }   

    render() {
        const providerId = this.props.match.params.id;
        const { tours, provider, revenueReport, totalCount, page, totalPage } = this.state;
        const isLoadingProvider = this.state.isLoadingProvider;
        const url = `url('${this.baseUrl+provider.avatarUrl}')`;

        return (
            <div className="provider-manage-page-container">
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
                        <h2 className='provider-name'>{provider.providerName}</h2>
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
                                {/* <div className='info-item'>
                                    <HiOutlineMail/>
                                    <div className="group">
                                        Available:
                                        <span className="content">{provider.tourAvailable} tours</span>
                                    </div>
                                </div>                              */}
                            </div>
                            <div className='provider-contact-info'>
                                <div className='info-item'>
                                    <HiOutlineMail/>
                                    <div className="group">
                                        Email:
                                        <span className="content">{provider.providerEmail}</span>
                                    </div>
                                </div>
                                <div className='info-item'>
                                    <HiOutlinePhone/>
                                    <div className="group">
                                        Phone:
                                        <span className="content">{provider.providerPhone}</span>
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
                    </div>
                </div>
                <button 
                    className={provider.isEnabled ? 'btn-disable' : 'btn-enable'}
                    onClick={this.disableEnableProvider}
                >
                    {provider.isEnabled ? "Disable provider" : "Enable provider"}
                </button>
                <hr className="section-divide-hr"></hr>
                <div className="tour-order-count-section">
                    <div className="tour-count">
                        <span className="title">Total Tours</span>
                        <span className="count-value">{provider.totalTourCount}</span>
                        <div className="tour-statistic">
                            <span className="main-places">Main places:&nbsp;Da Nang, Hoi An</span>
                            <span className="main-categories">
                                Main categories:&nbsp;
                                {provider.topCategories && provider.topCategories.map(item => `${item}, `)}
                            </span>
                        </div>
                    </div>
                    <div className="order-count">
                        <span className="title">Total Orders</span>
                        <span className="count-value">{provider.totalOrderCount}</span>
                        <div className="donut-chart">
                            <DonutChart
                                data={[
                                    {
                                        label: 'Confirmed',
                                        value: (provider.confirmedOrderCount/provider.totalOrderCount)*100
                                    },
                                    {
                                        label: 'Canceled',
                                        value: (provider.canceledOrderCount/provider.totalOrderCount)*100
                                    }
                                ]}
                                interactive={false}
                                height={100}
                                width={100}
                                legend={false}
                                innerRadius={0.6}
                                colors={['#64b450', '#cc3300']}
                                strokeColor={'#fff'}
                            />    
                            <div className="donut-chart__legends">
                                <span className="legends-item">
                                    <div className='legends__color'></div>
                                    {provider.confirmedOrderCount} confirmed
                                </span>
                                <span className="legends-item">
                                    <div className='legends__color canceled'></div>
                                    {provider.canceledOrderCount} canceled
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="section-divide-hr"></hr>
                <div className="all-tours-section">
                    <span className="title">All Tours</span>
                    <div className="list-tours">
                        <div className='list-tours-header'>
                            <div className='header__tour-id'>ID</div>
                            <div className='header__tour-name'>Tour Name</div>
                            <div className='header__tour-rating'>Rating</div>
                            <div className='header__tour-order'>Order</div>
                            <div className='header__tour-available'>Available</div>
                        </div>
                        {
                            tours.map(item => {
                                return (
                                    <div className="tour-item" key={'tour'+item.id}>
                                        <div className='tour-id'>{item.id}</div>
                                        <div className='tour-name'
                                            onClick={() => this.props.history.push(`/tours/${item.id}`)}
                                        >
                                            {item.tourName}
                                        </div>
                                        <div className='tour-rating'>{item.rating > 0 ? item.rating : 'Not rated'}</div>
                                        <div className='tour-order'>{item.orderCount}</div>
                                        <div className='tour-available'>
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </div>
                                    </div>
                                )
                            })
                        }        
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
                </div>
                <hr className="section-divide-hr"></hr>
                <div className="revenue-section">
                    <div className="quarter-picker-section">
                        <QuarterPicker getRevenue={this.getRevenue}/>
                    </div>
                    <div className="revenue__chart">
                        <Bar  
                            options={{ 
                                barPercentage: 0.3,
                                scales: {
                                    y: {
                                        title: { display: true, text: 'USD', font:{size:16}, padding: 8},
                                        ticks: { font: {size: 14} }                                     
                                    },
                                    x: { ticks: { font: {size: 16} } }
                                  }
                            }}
                            data={{
                                labels: revenueReport.monthLabels,
                                datasets: [{
                                    label: "revenue",
                                    data: revenueReport.revenue,
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                }]
                            }}
                        />
                    </div>          
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(ProviderDetailManage));