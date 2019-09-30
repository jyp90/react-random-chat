import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="container">
      <div>
        <p>ERROR</p>
      </div>
      <Link to="/">Home</Link>
    </div>
  );
};

export default Error;
