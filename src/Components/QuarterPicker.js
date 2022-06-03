import React from 'react'
import "../Styles/quarter-picker.scss";


class QuarterPicker extends React.Component {

    state = {
        year: new Date().getFullYear(),
        openYears: false,
        quarter: 1,
        openQuarters: false
    }

    quarters = [
        { id: 1, months: ["Jan", "Feb", "Mar"] },
        { id: 2, months: ["Apr", "May", "Jun"] },
        { id: 3, months: ["Jul", "Aug", "Sep"] },
        { id: 4, months: ["Oct", "Nov", "Dec"] },
    ]

    years = this.range(2020, 2040);

    componentDidMount() {
        this.props.getRevenue(this.state.quarter, this.state.year)
    }

    range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    handleToggleYears = () => {
        this.setState({
            openYears: !this.state.openYears
        })
    }

    handleChangeYear = (year) => {
        this.setState({
            year: year,
            openYears: false
        })
    }

    handleToggleQuarters = () => {
        this.setState({
            openQuarters: !this.state.openQuarters
        })
    }

    handleChangeQuarter = (quarterId) => {
        this.setState({
            quarter: quarterId,
            openQuarters: false
        })
        this.props.getRevenue(quarterId, this.state.year);
    }

    render() {
        const { year, openYears, quarter, openQuarters } = this.state;

        return (
            <div className="quarter-picker-wrapper">
                <div className="year-picker-section">
                    <span className="year-display" onClick={this.handleToggleYears}>{year}</span>
                    {
                    openYears &&
                        <div className="year-list">
                            {
                                this.years.map(item => {
                                    return (
                                        <div key={'year'+item} className="year-item" onClick={() => this.handleChangeYear(item)}>
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className="quarter-picker-section">
                    <span className="quarter-display" onClick={this.handleToggleQuarters}>Quarter {quarter}</span>
                    {
                        openQuarters &&
                        <div className="quarter-list">
                            {
                                this.quarters.map(item => {
                                    return (
                                        <div key={'quar'+item.id} className="quarter-item" onClick={() => this.handleChangeQuarter(item.id)}>
                                            {
                                                item.months.map(month => (<span key={month} className="month-item">{month}</span>))
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default QuarterPicker;