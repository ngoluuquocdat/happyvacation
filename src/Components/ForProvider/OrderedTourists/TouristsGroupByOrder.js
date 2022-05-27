import React from 'react';
import '../../../Styles/ForProvider/tourists-group-by-order.scss'

class TouristsGroupByOrder extends React.Component {

    render() {
        const touristGroup = this.props.touristGroup;

        return(
            <div className='tourist-group-wrapper'>
                <h3 className='tourist-group__id'>Order {touristGroup.orderId}</h3>
                <div className='tourist-group__start-end'>
                    <span className='tourist-group__place'>
                        Start:&nbsp;
                        {
                            touristGroup.startPoint.includes('CustomerPoint&') ?
                            `${touristGroup.startPoint.split('&')[1]} (Customer's location in ${touristGroup.startPoint.split('&')[2]})`
                            :
                            touristGroup.startPoint
                        }
                    </span>
                    <span className='tourist-group__place'>
                        End:&nbsp;
                        {
                            touristGroup.endPoint.includes('CustomerPoint&') ?
                            `${touristGroup.endPoint.split('&')[1]} (Customer's location in ${touristGroup.endPoint.split('&')[2]})`
                            :
                            touristGroup.endPoint
                        }
                    </span>
                </div>
                <div className="order-members">
                    <h3 className="section-sub-title">Adults</h3>
                    <div className="adults-table">
                        <div className="adults-table-heading">
                            <span>No.</span>
                            <span className="name">Full Name</span>
                            <span>Identity Number</span>
                            <span>Date of Birth</span>
                        </div>
                        <div className="adults-list">
                        {
                            touristGroup.adultsList.map((item, index) => {
                                return(
                                    <div className="adult-item">
                                        <span>{index+1}</span>
                                        <span className="name">{item.fullName}</span>
                                        <span>{item.identityNumber}</span>
                                        <span>{item.dob}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                    {
                        touristGroup.childrenList.length > 0 &&
                        <>
                            <h3 className="section-sub-title">Children</h3>
                            <div className="children-table">
                                <div className="children-table-heading">
                                    <span>No.</span>
                                    <span className="name">Full Name</span>
                                    <span>Identity Number</span>
                                    <span>Date of Birth</span>
                                </div>
                                <div className="children-list">
                                {
                                    touristGroup.childrenList.map((item, index) => {
                                        return(
                                            <div className="child-item">
                                                <span>{index+1}</span>
                                                <span className="name">{item.fullName}</span>
                                                <span>{item.identityNumber}</span>
                                                <span>{item.dob}</span>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }

}

const touristGroup = {
    orderId: 1, 
    startPoint: '',
    endPoint: '',
    adultsList: [],
    childrenList: []
    
}

export default TouristsGroupByOrder;