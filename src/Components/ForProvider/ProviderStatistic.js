import React from 'react';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Calendar } from 'react-date-range';
import DonutChart from 'react-donut-chart';
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
import '../../Styles/ForProvider/provider-statistic.scss'
import MonthPicker from '../MonthPicker';

class ProviderTour extends React.Component {

    state = {
        overall: {},
        revenueReport: {
            monthLabels: [],
            revenue: []
        },
        byQuarter: true
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        await this.getOverallStatistic();
    }

    // get overall statistic
    getOverallStatistic = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }        
		try {
            // this.setState({
            //     isLoadingProvider: true,
            // });   
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/overall-statistic`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );
            this.setState({
                overall: res.data,
            });
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        } finally {
            // this.setState({
            //     isLoadingProvider: false
            // })
        }
    } 


    // get revenue by quarter
    getRevenueByQuarter = async(quarter, year) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }        
		try {
            // this.setState({
            //     isLoadingProvider: true,
            // });   
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/revenue/by-quarter?quarterIndex=${quarter}&year=${year}`,
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
                this.props.history.push('/login');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        } finally {
            // this.setState({
            //     isLoadingProvider: false
            // })
        }
    } 

    // get revenue by month
    getRevenueByMonth = async(month, year) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }        
		try {
            // this.setState({
            //     isLoadingProvider: true,
            // });   
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/revenue/by-month?month=${month}&year=${year}`,
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
                this.props.history.push('/login');
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
            }
        } finally {
            // this.setState({
            //     isLoadingProvider: false
            // })
        }
    } 

    render() {
        const { overall, revenueReport, byQuarter } = this.state;

        return (
            <div className='provider-statistic-wrapper'>
                <div className='provider-order-header'>
                    <div className='title'>Statistic</div>
                    <div className='sub-title'>See and process tour orders for your company</div>
                </div>
                <span className="section-title">Overall</span>
                <div className="tour-order-count-section">
                    <div className="tour-count">
                        <span className="title">Total Tours</span>
                        <span className="count-value">{overall.totalTourCount}</span>
                        <div className="tour-statistic">
                            <span className="main-places">
                                Main places:&nbsp;
                                {overall.mainPlaces && overall.mainPlaces.map(item => `${item}, `)}
                            </span>
                            <span className="main-categories">
                                Main categories:&nbsp;
                                {overall.mainCategories && overall.mainCategories.map(item => `${item}, `)}
                            </span>
                        </div>
                    </div>
                    <div className="order-count">
                        <span className="title">Total Orders</span>
                        <span className="count-value">{overall.totalOrderCount}</span>
                        <div className="donut-chart">
                            <DonutChart
                                data={[
                                    {
                                        label: 'Confirmed',
                                        value: (overall.confirmedOrderCount/overall.totalOrderCount)*100
                                    },
                                    {
                                        label: 'Canceled',
                                        value: (overall.canceledOrderCount/overall.totalOrderCount)*100
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
                <span className="section-title">Revenue</span>
                <div className="revenue-section">
                    <div className="revenue-type">
                        <span className="revenue-type-title">{ byQuarter ? "Revenue report by quarter" : "Revenue report by month" }</span>
                        <span className="quarter-month-btn" onClick={() => this.setState({byQuarter: !this.state.byQuarter})}>
                            Change to { byQuarter ? "month" : "quarter" }
                        </span>
                    </div>
                    
                    <div className="quarter-picker-section">
                        {
                            byQuarter ?
                            <QuarterPicker getRevenue={this.getRevenueByQuarter}/>
                            :
                            <MonthPicker getRevenue={this.getRevenueByMonth}/>
                        }
                    </div>
                    <div className="charts">                    
                        <div className="revenue__chart">
                            <Bar  
                                options={{ 
                                    barPercentage: 0.2,
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
                        <div className="donut-chart">
                            <DonutChart
                                data={[
                                    {
                                        label: 'Confirmed',
                                        value: (revenueReport.confirmedOrderCount/revenueReport.totalOrderCount)*100
                                    },
                                    {
                                        label: 'Canceled',
                                        value: (revenueReport.canceledOrderCount/revenueReport.totalOrderCount)*100
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
                                    {revenueReport.confirmedOrderCount} confirmed
                                </span>
                                <span className="legends-item">
                                    <div className='legends__color canceled'></div>
                                    {revenueReport.canceledOrderCount} canceled
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="statistic-info">
                        <div className="statistic-report">
                            <span className="title">Top places in this { byQuarter ? "quarter" : "month" }:&nbsp;</span>
                            <div className="statistic-table">
                                <div className="statistic-row header">
                                    <div className="row-item">No.</div>
                                    <div className="row-item">Place</div>
                                    <div className="row-item">Orders</div>
                                </div>
                                {
                                    revenueReport.topOrderedPlaces && 
                                    revenueReport.topOrderedPlaces.map((item, index) => {
                                        return (
                                            <div className="statistic-row">
                                                <div className="row-item">{index+1}</div>
                                                <div className="row-item">{item.placeName}</div>
                                                <div className="row-item">{item.orderCount}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="statistic-report">
                            <span className='title'>Top categories in this { byQuarter ? "quarter" : "month" }:&nbsp;</span>
                            <div className="statistic-table">
                                <div className="statistic-row header">
                                    <div className="row-item">No.</div>
                                    <div className="row-item">Category</div>
                                    <div className="row-item">Orders</div>
                                </div>
                                {
                                    revenueReport.topOrderedCategories && 
                                    revenueReport.topOrderedCategories.map((item, index) => {
                                        return (
                                            <div className="statistic-row">
                                                <div className="row-item">{index+1}</div>
                                                <div className="row-item">{item.categoryName}</div>
                                                <div className="row-item">{item.orderCount}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>       
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>
        )
    }
}

const provider = { 
    topCategories:["cultural tour", "discovery tour"],
    totalOrderCount: 23,
    totalTourCount: 7,
    confirmedOrderCount: 13,
    canceledOrderCount: 7
}



// const revenueReport = {
//     monthLabels: ["April", "May", "June"],
//     revenue: [1408, 934, 380],
//     canceledOrderCount: 1,
//     confirmedOrderCount: 3,
//     totalOrderCount: 4
// }

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(ProviderTour));