import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import Home from './Home';
import ChatRoom from './ChatRoom';
import Error from './Error';
import './css/style.scss';

const App = (props) => {
  console.log('props', props);
  const {
    roomMatch,
    roomConnection,
    roomDisconnection,
    textSending,
    handleRoomConnection,
    handleReconnection,
    handleNextChatting,
    handleTextSending,
    subscribeSocketEmit,
    subscribeTextMessage,
    unsubscribeTextMessage
  } = props;

  useEffect(() => {
    subscribeSocketEmit();
  }, [ subscribeSocketEmit ]);

  useEffect(() => {
    subscribeTextMessage();

    return () => {
      unsubscribeTextMessage();
    };
  }, [ subscribeTextMessage, textSending.chats ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>SAY HELLO!</h1>
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
          exact path="/chat"
          render={routerProps => (
            <ChatRoom
              {...routerProps}
              roomMatch={roomMatch}
              roomConnection={roomConnection}
              textSending={textSending}
              roomDisconnection={roomDisconnection}
              handleReconnection={handleReconnection}
              handleNextChatting={handleNextChatting}
              handleTextSending={handleTextSending}
            />
          )}
        />

        <Route
          exact path="/"
          render={routerProps => (
            <Home
              {...routerProps}
              roomMatch={roomMatch}
              roomConnection={roomConnection}
              handleRoomConnection={handleRoomConnection}
            />
          )}
        />

      </Switch>
    </div>
  );
}

export default App;
