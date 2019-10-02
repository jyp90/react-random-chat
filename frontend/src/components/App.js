import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import Home from './Home';
import ChatRoom from './ChatRoom';
import Error from './Error';
import './css/normalize.v8.0.1.css';
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
      <header className="app-header">
        <h1 className="logo">SAY HELLO!</h1>
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
