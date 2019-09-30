import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import socketIOClient from 'socket.io-client';
import Home from './Home';
import Error from './Error';
import './css/style.scss';

const App = (props) => {
  console.log('props', props);
  const {
  } = props;

  const endPoint = 'http://localhost:8080';
  const [ chatNickname, setChatNickname ] = useState(null);
  const [ name, setName ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('NAME!!!!!',name);

    if (!name.trim()) {
      return;
    }
    const socket = socketIOClient(endPoint);
    socket.emit('requestRandomChat', name);
    socket.on('initialConnect', data => {
      console.log(data);
      setName('');
      setChatNickname(data.userName);
    });

    // socket.on('initialConnect', data => {
    //   console.log(data);
    //   setName('');
    //   setChatNickname(data.userName);
    // });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SAY HELLO!</h1>
      </header>

      <div>
        <h2>Random Chat</h2>
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="input-basic"
            name="user_name"
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

      {chatNickname && (
        <div>
          <p>{chatNickname}으로 입장하셨습니다.</p>
        </div>
      )}
      

      {/* <Switch>
        <Route
          exact path="/error"
          render={routerProps => (
            <Error
              {...routerProps}
            />
          )}
        />

        <Route
          exact path="/"
          render={routerProps => (
            <Home
              {...routerProps}
            />
          )}
        />
      </Switch> */}
    </div>
  );
}

export default App;
