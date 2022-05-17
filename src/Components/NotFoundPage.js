import React from 'react'
import { withRouter, Link } from "react-router-dom";
import '../Styles/not-found.scss';

class NotFoundPage extends React.Component {

    backToPreviousPage = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <div className='not-found-page-wrapper'>
                <h1 className='not-found-text'>404 NOT FOUND</h1>
                <p className='not-found-back' onClick={this.backToPreviousPage}>Back to home page</p>               
            </div>
        )
    }

}


export default withRouter(NotFoundPage);