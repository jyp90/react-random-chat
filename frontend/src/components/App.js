import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import ChatRoom from './ChatRoom';
import Error from './Error';
import './css/normalize.v8.0.1.css';
import './css/style.scss';

const App = (props) => {
  const {
    roomMatch,
    roomConnection,
    textSending,
    handleRoomConnection,
    handleReconnection,
    handleNextChatting,
    handleTextSending,
    handleTypingStart,
    handleTypingStop,
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
  }, [ textSending.chats, subscribeTextMessage, unsubscribeTextMessage ]);

  return (
    <div className="app-container">
      {roomConnection.isError && <Redirect to="/error" />}
      <header className="app-header">
        <h1 className="logo">
          <span>SAY HELLO!</span>
        </h1>
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
              handleReconnection={handleReconnection}
              handleNextChatting={handleNextChatting}
              handleTextSending={handleTextSending}
              handleTypingStart={handleTypingStart}
              handleTypingStop={handleTypingStop}
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
