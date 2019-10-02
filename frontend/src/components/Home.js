import React, { useState } from 'react';
import { Redirect } from 'react-router';

const Home = (props) => {
  const {
    roomConnection,
    handleRoomConnection
  } = props;

  const [ name, setName ] = useState('');

  return (
    <div className="container">
      {roomConnection.isConnected && <Redirect to="/chat" />}

      <h2>Random Chat</h2>
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
          입장
        </button>
      </form>
    </div>
  );
};

export default Home;
