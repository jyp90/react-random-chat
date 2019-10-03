import React from 'react';
import './css/error.scss';

const Error = () => {
  return (
    <div className="container">
      <div className="error-box">
        <p className="error-title">DISCONNECTED</p>
        <p className="error-msg">Please Retry Later!</p>
        <a href="/">Home</a>
      </div>
    </div>
  );
};

export default Error;
