import React from 'react'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { Pagination } from "@mui/material";
import MemberCard from './MemberCard';
import '../../Styles/ForAdmin/members-page.scss'

class MembersPage extends React.Component {

    state = {
        members: [],
        totalPage: 2,
        totalCount: 0,
        page: 1,
        perPage: 3,
        userId: '',
        username: '',
        keyword: '',
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async getMembers(token, userId, username, keyword, page, perPage) {
        try {          
            this.setState({
                isLoading: true,
            });            
            var params = new URLSearchParams();
            params.append("userId", userId);
            params.append("username", username);
            params.append("keyword", keyword);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(
                `${this.baseUrl}/api/Users/manage`,
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
                members: res.data.items                
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
        let { userId, username, keyword, page, perPage } = this.state;
        userId = userId !== '' ? userId : 0;
        this.getMembers(token, userId, username, keyword, page, perPage)
    }

    async componentDidUpdate(prevProps, prevState) {
        // on page change
        if(prevState.page !== this.state.page && prevState.tours === this.state.tours) {
            // check jwt token
            const token = localStorage.getItem('user-token');
            if(!token) {
                this.props.history.push('/admin/login');
            }
            let { userId, username, keyword, page, perPage } = this.state;
            userId = userId !== '' ? userId : 0;
            this.getMembers(token, userId, username, keyword, page, perPage)
        }
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
    searchMembers = () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        let { userId, username, keyword, page, perPage } = this.state;
        userId = userId !== '' ? userId : 0;
        this.getMembers(token, userId, username, keyword, page, perPage)
    }

    // handle reset search tour
    resetSearch = () => {
        this.setState({
            userId: '',
            username: '',
            keyword: ''
        })
    }

    // disable - enable
    disableEnableMember = async(userId) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/admin/login');
        }
        const isEnabled = [...this.state.members].find(el => el.id === userId).isEnabled
        console.log('enable', isEnabled)
        let apiUrl = isEnabled 
                    ? `${this.baseUrl}/api/users/${userId}/disable` 
                    : `${this.baseUrl}/api/users/${userId}/enable`;
        try {
            this.setState({
                isLoadingMember: true,
            });   
            // call api
            let res = await axios.put(
                apiUrl,
                {},
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );

            // update UI
            let members = this.state.members;
            const index = this.state.members.findIndex((el) => el.id === res.data.id);
            members[index] = res.data
            this.setState({
                members: members
            })   
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


    render() {
        const { members, page, totalPage, totalCount, isLoading } = this.state;
        const { userId, username, keyword } = this.state;

        return (
            <div className='members-page-container'>
                <div className='members-page-header'>
                    <div className='title'>Member management</div>
                    <div className='sub-title'>See and manage members in the system</div>
                </div>
                <div className='search-area'>
                    <div className='search-area-upper'>
                        <div className='search-group'>
                            <span className='search-label'>User ID: </span>
                            <input className='search-input' name='userId' placeholder='Type here' value={userId} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Username: </span>
                            <input className='search-input' name='username' placeholder='Type here' value={username} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Keyword: </span>
                            <input className='search-input name' name='keyword' placeholder='Type name, phone or email' value={keyword} onChange={this.inputChange}/>
                        </div>
                    </div>

                    <div className='button-area'>
                        <button className='btn-search' onClick={this.searchMembers}>Search</button>
                        <button className='btn-reset' onClick={this.resetSearch}>Reset</button>
                    </div>
                </div>
                <div className='members-page-body'>
                    <div className='list-members-wrap'>
                        <div className='members-number'>
                            {
                                isLoading ? ' ' : (totalCount > 1 ? `${totalCount} members` : `${totalCount} member`)
                            }                       
                        </div>
                        <div className='list-members'>
                            <div className='list-members-header'>
                                <div className='list-members-header-item id'>ID</div>
                                <div className='list-members-header-item member-user-name'>Account Information</div>
                                <div className='list-members-header-item first-name'>First Name</div>
                                <div className='list-members-header-item last-name'>Full Name</div>
                                <div className='list-members-header-item phone'>Phone</div>   
                                <div className='list-members-header-item email'>Email</div>   
                                <div className='list-members-header-item enable'>Enable</div>                           
                                <div className='list-members-header-item action'>Action</div>
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
                                    members.map((item) => {
                                        return (
                                            <MemberCard key={'mem'+item.id} user={item} disableEnableMember={this.disableEnableMember}/>
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

export default connect(mapStateToProps)(withRouter(MembersPage));