import React, { Component } from 'react';
import TouristSiteCard from './TouristSiteCard';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Pagination } from '@mui/material';
import { FaCaretDown } from 'react-icons/fa';
import '../../Styles/tourist-site-list.scss'

class TouristSiteList extends Component {

    state = {
        sites: [],
        page: 1,
        perPage: 4,
        totalPage: 4
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        // call api to get list tourist sites
        const placeId = this.props.placeId;
        const { page, perPage } = this.state;
        try {
            let res = await axios.get(`${this.baseUrl}/api/Places/${placeId}/touristSites?page=${page}&perPage=${perPage}`);
            this.setState({
                sites: res.data.items,
                totalPage: res.data.totalPage,
            }) 
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                this.baseUrl = '';       
                return;
            } 
        }
    }

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
          page: page
        })
    }

    render() {
        const sites = this.state.sites;
        const baseUrl = this.baseUrl;
        const { page, totalPage } = this.state;
        return (           
            <div className='tourist-site-list-wrapper'>
                <div className='tourist-site-list'>
                    {
                        sites.map(item => {
                            return(
                                <TouristSiteCard key={item.id} site={item} baseUrl={baseUrl}/>
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

const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(TouristSiteList));
