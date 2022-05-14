import React, { Component } from 'react';
import './medal.scss';

class Medal extends Component {

    render() {
        let top = this.props.top ? this.props.top : 0;
        let left = this.props.left ? this.props.left : 0;

        const rank = this.props.rank;
        let color = '';
        switch(rank) {
            case 1:
                color = 'gold'
                break;
            case 2:
                color = 'silver'
                break;
            case 3:
                color = 'bronze'
                break;
        }
        return (
            <div className="quiz-medal" style={{top: top, left: left}}>
                <div className={`quiz-medal__circle quiz-medal__circle--${color}`}>
                    <span>
                        {rank}
                    </span>
                </div>
                <div className="quiz-medal__ribbon quiz-medal__ribbon--left"></div>
                <div className="quiz-medal__ribbon quiz-medal__ribbon--right"></div>
            </div>
        );
    }
}

export default Medal;
