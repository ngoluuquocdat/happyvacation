import React from 'react'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { Pagination } from "@mui/material";
import ProviderCard from './ProviderCard';
import '../../Styles/ForAdmin/providers-page.scss'

class ProvidersPage extends React.Component {

    state = {
        providers: [],
        totalPage: 2,
        totalCount: 0,
        page: 1,
        perPage: 3,
        providerId: '',
        ownerId: '',
        keyword: '',
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async getProviders(token, providerId, ownerId, keyword, page, perPage) {
        try {          
            this.setState({
                isLoading: true,
            });            
            var params = new URLSearchParams();
            params.append("providerId", providerId);
            params.append("ownerId", ownerId);
            params.append("keyword", keyword);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(
                `${this.baseUrl}/api/Providers/manage`,
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
                providers: res.data.items                
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
                isLoading: false
            })
        }        
    }

    async componentDidMount() {
        // check jwt token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login');
        }
        
        // call api to get registrations
        let { providerId, ownerId, keyword, page, perPage } = this.state;
        providerId = providerId !== '' ? providerId : 0;
        ownerId = ownerId !== '' ? ownerId : 0;
        this.getProviders(token, providerId, ownerId, keyword, page, perPage)
    }

    async componentDidUpdate(prevProps, prevState) {
        // on page change
    } 

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    // handle input change
    inputChange = (event) => {
        const key = event.target.name;
        this.setState({
            [key]: event.target.value
        })
    }

    // handle search tour click
    searchProviders = () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        let { providerId, ownerId, keyword, page, perPage } = this.state;
        providerId = providerId !== '' ? providerId : 0;
        ownerId = ownerId !== '' ? ownerId : 0;
        this.getProviders(token, providerId, ownerId, keyword, page, perPage)
    }

    // handle reset search tour
    resetSearch = () => {
        this.setState({
            providerId: '',
            ownerId: '',
            keyword: ''
        })
    }


    render() {
        const { providers, page, totalPage, totalCount, isLoading } = this.state;
        const { providerId, ownerId, keyword } = this.state;

        return (
            <div className='providers-page-container'>
                <div className='providers-page-header'>
                    <div className='title'>Tour provider management</div>
                    <div className='sub-title'>See and manage tour providers</div>
                </div>
                <div className='search-area'>
                    <div className='search-area-upper'>
                        <div className='search-group'>
                            <span className='search-label'>Provider ID: </span>
                            <input className='search-input' name='providerId' placeholder='Type here' value={providerId} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Owner ID: </span>
                            <input className='search-input' name='ownerId' placeholder='Type here' value={ownerId} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Keyword: </span>
                            <input className='search-input name' name='keyword' placeholder='Type name, phone or email' value={keyword} onChange={this.inputChange}/>
                        </div>
                    </div>

                    <div className='button-area'>
                        <button className='btn-search' onClick={this.searchProviders}>Search</button>
                        <button className='btn-reset' onClick={this.resetSearch}>Reset</button>
                    </div>
                </div>
                <div className='providers-page-body'>
                    <div className='list-providers-wrap'>
                        <div className='providers-number'>
                            {
                                isLoading ? ' ' : (totalCount > 1 ? `${totalCount} providers` : `${totalCount} provider`)
                            }                       
                        </div>
                        <div className='list-providers'>
                            <div className='list-providers-header'>
                                <div className='list-providers-header-item id'>ID</div>
                                <div className='list-providers-header-item user-id'>Member ID</div>
                                <div className='list-providers-header-item provider-name'>Provider Name</div>
                                <div className='list-providers-header-item date'>Join Date</div>
                                <div className='list-providers-header-item rating'>Average Rating</div>
                                <div className='list-providers-header-item enable'>Enable</div>                               
                                <div className='list-providers-header-item action'>Action</div>
                            </div>
                            <div className='list-tour-content'>
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
                                    providers.map((item) => {
                                        return (
                                            <ProviderCard key={'prov'+item.id} provider={item}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    totalPage > 1 && (
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
                    )
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

export default connect(mapStateToProps)(withRouter(ProvidersPage));