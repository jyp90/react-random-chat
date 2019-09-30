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
  const [ name, setName ] = useState('');
  const [ myInfo, setMyInfo ] = useState(null);
  const [ partnerInfo, setPartnerInfo ] = useState(null);
  const [ isConnecting, setConnectingStatus ] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('NAME!!!!!',name);

    if (!name.trim()) {
      return;
    }
    const socket = socketIOClient(endPoint);
    socket.emit('requestRandomChat', name);
    socket.on('initialConnect', data => {
      console.log('INITIAL CONNECT', data);
      if (data.connected) {
        setName('');
        setMyInfo({
          id: data.userId,
          name: data.userName
        });
      }
      socket.on('completeMatch', roomInfo => {
        console.log(roomInfo);
        if (roomInfo.matched) {
          console.log(roomInfo.users);
          console.log(roomInfo.users.user1);
          console.log(roomInfo.users.user1.id);
          console.log(data.userId);
          if (roomInfo.users.user1.id === data.userId) {
            setPartnerInfo(roomInfo.users.user2)
          } else {
            setPartnerInfo(roomInfo.users.user1)
          }
          console.log('PARTNER!!!',partnerInfo);
          setConnectingStatus(false);
        } else {
          setConnectingStatus(true);
        }
      });
    });
  };

  useEffect(() => {
    console.log('MYINFO', myInfo);
  }, [ myInfo ]);

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

      {myInfo && (
        <div>
          <p>{myInfo.name}으로 입장하셨습니다.</p>
        </div>
      )}
      {isConnecting && (
        <div>
          <p>상대방과 연결중입니다.</p>
        </div>
      )}
      {partnerInfo && (
        <div>
          <p>{partnerInfo.name}님과 연결되었습니다.</p>
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
