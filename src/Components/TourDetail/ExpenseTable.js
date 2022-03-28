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
            <div className='expense-table' onClick={() => this.handleOpenContent()}>
                <div className='include'>
                    <ul className='list'>
                        {
                            includes.map((item) => {
                                return (
                                    <li key={item.id}><GiCheckMark className='icon'/> {item.expenseContent}</li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className='exclude'>
                    <ul className='list'>
                        {
                            excludes.map((item) => {
                                return (
                                    <li key={item.id}><CgClose className='icon'/> {item.expenseContent}</li>
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
  