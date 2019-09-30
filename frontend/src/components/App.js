import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import socketIOClient from 'socket.io-client';
import Home from './Home';
import Error from './Error';
import './css/App.css';

const App = (props) => {
  console.log('props', props);
  const {
  } = props;

  const [ response, setResponse ] = useState(false);
  const [ endPoint, setEndPoint ] = useState('http://localhost:8080');
  
  useEffect(() => {
    const socket = socketIOClient(endPoint);
    socket.on('FromAPI', data => setResponse({
      response: data
    }));
  }, [ endPoint ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SAY HELLO!</h1>
        <p>{ response }</p>
      </header>

      <Switch>
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
      </Switch>
    </div>
  );
}

export default App;
