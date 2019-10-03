import React, { useState } from 'react';
import { Redirect } from 'react-router';
import './css/home.scss';

const Home = (props) => {
  const {
    roomConnection,
    handleRoomConnection
  } = props;

  const [ name, setName ] = useState('');

  return (
    <div className="container">
      {roomConnection.isConnected && <Redirect to="/chat" />}
      {roomConnection.isError && <Redirect to="/error" />}

      <div className="home-banner"></div>
      <div className="box-wrapper">
        <div className="align-center">
          <h2 className="home-title">Talk to Stranger</h2>
          <p className="home-desc">
            Random Chat is the best way to meet new people online. You can chat to thousands of people from around the world for free. Try it now!
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();

              setName('');
              handleRoomConnection(name);
            }}
          >
            <input
              type="text"
              className="input-basic"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button
              type="submit"
              className="btn-submit"
            >
              START
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
