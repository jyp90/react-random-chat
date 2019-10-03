import React, { useState } from 'react';
import { Redirect } from 'react-router';
import './css/home.scss';

const Home = (props) => {
  const {
    roomConnection,
    handleRoomConnection
  } = props;

  const [ name, setName ] = useState('');
  const [ isNameLengthOver, setNameLengthOver ] = useState(false);
  const MAX_NAME_LENGTH = 20;

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

              handleRoomConnection(name);
              setName('');
            }}
          >
            <input
              type="text"
              className="input-basic"
              value={name}
              placeholder="Nickname"
              onChange={e => {
                e.target.value.trim().length > MAX_NAME_LENGTH ? setNameLengthOver(true) : setNameLengthOver(false);
                setName(e.target.value);
              }}
            />
            <button
              type="submit"
              className="btn-submit"
            >
              START
            </button>
            {isNameLengthOver && (
              <p className="warn-message">
                Nickname cannot be more than {MAX_NAME_LENGTH} characters
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
