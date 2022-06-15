import React from 'react'
import "../Styles/quarter-picker.scss";


class MonthPicker extends React.Component {

    state = {
        year: new Date().getFullYear(),
        openYears: false,
        month: { id: 1, name: "January" },
        openMonths: false
    }

    months = [
        { id: 1, name: "January" },
        { id: 2, name: "February" },
        { id: 3, name: "March" },
        { id: 4, name: "April" },
        { id: 5, name: "May" },
        { id: 6, name: "June" },
        { id: 7, name: "July" },
        { id: 8, name: "August" },
        { id: 9, name: "September" },
        { id: 10, name: "October" },
        { id: 11, name: "November" },
        { id: 12, name: "December" },
    ]

    years = this.range(2020, 2040);

    range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    componentDidMount() {
        this.props.getRevenue(this.state.month.id, this.state.year)
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

    handleToggleMonths = () => {
        this.setState({
            openMonths: !this.state.openMonths
        })
    }

    handleChangeMonth = (month) => {
        this.setState({
            month: month,
            openMonths: false
        })
        this.props.getRevenue(month.id, this.state.year);
    }

    render() {
        const { year, openYears, month, openMonths } = this.state;

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
                    <span className="quarter-display" onClick={this.handleToggleMonths}>{month.name}</span>
                    {
                        openMonths &&
                        <div className="quarter-list">
                            {
                                this.months.map(item => {
                                    return (
                                        <div key={'month'+item.id} className="quarter-item" onClick={() => this.handleChangeMonth(item)}>
                                            {item.name}
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

export default MonthPicker;