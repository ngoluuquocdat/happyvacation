import React, { Component } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';
import '../../Styles/expense-table.scss'

class ExpenseTable extends Component {

    render() {
        const expenses = this.props.expenses;
        const includes = expenses.filter((item) => (item.isIncluded === true));
        const excludes = expenses.filter((item) => (item.isIncluded === false));

        return (           
            <div className='expense-table'>
                <div className='include'>
                    <ul className='list'>
                        {
                            includes.map((item, index) => {
                                return (
                                    <li key={index} className='expense-item'>
                                        <div className='icon-wrapper'>
                                            <GiCheckMark className='icon'/> 
                                        </div>
                                        <div className='expense-content'>
                                            {item.content}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className='exclude'>
                    <ul className='list'>
                        {
                            excludes.map((item, index) => {
                                return (
                                    <li key={index} className='expense-item'>
                                        <div className='icon-wrapper'>
                                            <CgClose className='icon'/> 
                                        </div>
                                        <div className='expense-content'>
                                            {item.content}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>    
                </div>
            </div>
        );
    }
}

export default ExpenseTable;
  