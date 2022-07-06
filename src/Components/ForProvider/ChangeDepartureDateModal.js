import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Calendar } from 'react-date-range';
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';
import { BsArrowRight } from 'react-icons/bs';
import '../../Styles/ForProvider/change-departure-date-modal.scss';

class ChangeDepartureDateModal extends React.Component {
    state = {
        showDatePicker: false,
        newDate: null,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // toggle date picker
    handleDateClick = () => {
        let showDatePicker = this.state.showDatePicker;
        this.setState({
            showDatePicker: !showDatePicker
        })
    }

    // date select
    handleDateSelect = (date) => {
        this.setState({
            newDate: date,
            showDatePicker: false
        })
    }

    // convert date time to string dd/MM/yyyy
    dateTimeToString = (date) => {
        return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
    }

    // save new departure date
    // saveChange = async() => {
    //     const token = localStorage.getItem('user-token');
    //     if(!token) {
    //         this.props.history.push('/login', {prevPath: this.props.location.pathname});
    //     }

    //     const newDate = this.state.newDate ? this.dateTimeToString(this.state.newDate) : this.props.currentDepartureDate;
    //     const orderId = this.props.changingDepartureOrderId;

    //     try {
    //         this.setState({
    //             isLoading: true
    //         })
    //         let res = await axios.put(
    //             `${this.baseUrl}/api/Orders/${orderId}/departure`,  
    //             {
    //                 newDate: newDate
    //             },            
    //             {
    //                 headers: { Authorization:`Bearer ${token}` }
    //             }
    //         );  
    //         toast.success('Changed successfully');
    //         this.props.updateNewDeparture(res.data.id, res.data.departureDate);
    //     } catch(e) {
    //         console.log(e);
    //         toast.error('Error occurred');
    //         this.closeChangeDateModal();
    //     }
    // }

    saveChange = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }

        const newDate = this.state.newDate ? this.dateTimeToString(this.state.newDate) : this.props.currentDepartureDate;
        const orderId = this.props.changingDepartureOrderId;

        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.put(
                `${this.baseUrl}/api/Orders/${orderId}/departure`,  
                {
                    newDate: newDate
                },            
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  
            toast.success('Changed successfully');
            this.props.updateNewDeparture(res.data.id, res.data.departureDate, res.data.modifiedDate);
        } catch(e) {
            console.log(e);
            toast.error('Error occurred');
            this.closeChangeDateModal();
        }
    }

    // close modal
    closeChangeDateModal = () => {
        this.props.closeChangeDateModal();
    }

    render() {
        const { changingDepartureOrderId, currentDepartureDate } = this.props;
        const { showDatePicker, newDate, isLoading } = this.state;

        return (
            <div className='change-date__form'>
                {
                    isLoading &&
                    <div className="change-date__loading-container">
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={50}
                            width={50}
                        />
                    </div>
                }
                <span className='change-date__close-btn' onClick={this.closeChangeDateModal}>X</span>
                <span className='change-date__order-id'>
                    OrderId: {changingDepartureOrderId}
                </span>
                <span className='change-date__title'>Change departure date</span>
                <div className='change-date__date-section'>
                    <span className='change-date__current-date'>{currentDepartureDate}</span>
                    <BsArrowRight className='arrow'/>
                    <span className='change-date__new-date'
                        onClick={this.handleDateClick}
                    >
                        {
                            newDate 
                            ? `${("0" + newDate.getDate()).slice(-2)}/${("0" + (newDate.getMonth()+1)).slice(-2)}/${newDate.getFullYear()}`
                            : currentDepartureDate
                        }                              
                        {
                            showDatePicker &&
                            <div className="date-picker" onClick={(event) => event.stopPropagation()}>
                                <Calendar
                                    date={newDate}
                                    minDate={new Date()}
                                    onChange={(date) => this.handleDateSelect(date)}
                                />
                            </div>
                        }
                    </span>
                </div>
                <button className='change-date__save-btn' onClick={this.saveChange}>Save</button>                
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(ChangeDepartureDateModal);