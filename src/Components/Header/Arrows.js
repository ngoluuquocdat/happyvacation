import React from 'react';
import '../../Styles/arrow.css';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

export const Left = props => {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow-left"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <FiArrowLeft style={{marginTop: "25%"}}/>
    </div>
  );
};

export const Right = props => {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow-right"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <FiArrowRight style={{marginTop: "25%"}}/>
    </div>
  );
};
